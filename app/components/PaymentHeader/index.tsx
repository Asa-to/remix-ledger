import { Box, Select, Text } from "@mantine/core";
import { Payment, User } from "@prisma/client";
import { FC, useState } from "react";
import { getUserExpectationPay } from "./getUserExpectationPay";
import { getUserTotalPay } from "./getUserTotalPay";

type Props = {
  date: Date;
  payments: Payment[];
  user: User;
};

export const PaymentHeader: FC<Props> = (props) => {
  const { date, payments, user } = props;

  const totalExpense = Math.abs(
    payments
      .filter((item) => item.value < 0)
      .reduce((total, curVal) => total + curVal.value, 0),
  );

  const categories = Array.from(new Set(payments.map((item) => item.category)));
  const [curCategory, setCurCategory] = useState<string | null>(categories[0]);
  const curCategorySum = payments
    .filter((item) => item.category === curCategory)
    .reduce((pre, cur) => pre + cur.value, 0);
  const myBurden =
    getUserExpectationPay({ userId: user.id, payments }) -
    getUserTotalPay({
      userId: user.id,
      payments,
    });

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
      <Text>{user.name}の負担額</Text>
      <Text>
        {getUserExpectationPay({
          userId: user.id,
          payments,
        }).toLocaleString()}
      </Text>
      <Text>円</Text>
      <Text>{user.name}の精算額</Text>
      <Text>{myBurden < 0 ? 0 : myBurden.toLocaleString()}</Text>
      <Text>円</Text>
      <Select value={curCategory} data={categories} onChange={setCurCategory} />
      <Text>{Math.abs(curCategorySum)}</Text>
      <Text>円</Text>
    </Box>
  );
};
