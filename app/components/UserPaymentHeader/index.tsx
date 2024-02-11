import { Box, Select, Text } from "@mantine/core";
import { Payment, User, UserPayment } from "@prisma/client";
import { FC, useState } from "react";

type Props = {
  date: Date;
  userPayments: UserPayment[];
};

export const UserPaymentHeader: FC<Props> = (props) => {
  const { date, userPayments } = props;

  const totalExpense = Math.abs(
    userPayments
      .filter((item) => item.value < 0)
      .reduce((total, curVal) => total + curVal.value, 0),
  );

  const categories = Array.from(
    new Set(userPayments.map((item) => item.category)),
  );
  const [curCategory, setCurCategory] = useState<string | null>(categories[0]);
  const curCategorySum = userPayments
    .filter((item) => item.category === curCategory)
    .reduce((pre, cur) => pre + cur.value, 0);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "120px 80px 1fr",
        gap: "8px",
        alignItems: "center",
      }}
    >
      <Text>{date.getMonth() + 1}月総出費</Text>
      <Text>{Math.abs(totalExpense).toLocaleString()}</Text>
      <Text>円</Text>
      <Select value={curCategory} data={categories} onChange={setCurCategory} />
      <Text>{Math.abs(curCategorySum)}</Text>
      <Text>円</Text>
    </Box>
  );
};
