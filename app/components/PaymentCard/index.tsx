import { Box, Text } from "@mantine/core";
import type { Payment, User } from "@prisma/client";
import type { FC } from "react";

type StringifyDates<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

type Props = {
  payments: StringifyDates<Payment>[];
  users: StringifyDates<User>[];
};

export const PaymentCard: FC<Props> = (props) => {
  const { payments, users } = props;
  const total = payments.reduce((total, curVal) => total + curVal.value, 0);
  let curDate = "";
  function formatDateString(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}年${month}月${day}日`;
  }

  return (
    <Box>
      {payments.map((payment) => {
        const flag = curDate !== formatDateString(payment.payDate);
        curDate = formatDateString(payment.payDate);
        return (
          <Box key={`payment ${curDate} ${payment.id}`}>
            {flag && (
              <Box
                display="grid"
                sx={{
                  gridTemplateColumns: "repeat(2, 1fr)",
                  backgroundColor: "#e0e0e0",
                }}
              >
                <Text>{formatDateString(payment.payDate)}</Text>
                <Text align="right">{total}</Text>
              </Box>
            )}
            <Box display="grid" sx={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              <Text>
                {users.filter((user) => user.id === payment.userId)?.[0].name}
              </Text>
              <Text>{payment.category}</Text>
              <Text align="right">{payment.value}</Text>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
