import { Box, Text } from "@mantine/core";
import type { Payment, User } from "@prisma/client";
import type { FC } from "react";
import { formatDateTime } from "~/utils/date/format";

type Props = {
  payments: Payment[];
  users: User[];
};

export const PaymentCard: FC<Props> = (props) => {
  const { payments, users } = props;
  const total = payments.reduce((total, curVal) => total + curVal.value, 0);
  let curDate = "";

  return (
    <Box>
      {payments.map((payment) => {
        const formatPayDate = formatDateTime(payment.payDate, "YYYY年MM月DD日");
        const isSameDate = curDate === formatPayDate;
        curDate = formatPayDate;
        return (
          <Box key={`payment ${curDate} ${payment.id}`}>
            {!isSameDate && (
              <Box
                display="grid"
                sx={{
                  gridTemplateColumns: "repeat(2, 1fr)",
                  backgroundColor: "#e0e0e0",
                }}
              >
                <Text>{formatPayDate}</Text>
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
