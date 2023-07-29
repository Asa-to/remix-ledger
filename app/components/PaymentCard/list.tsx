import { Box, Text } from "@mantine/core";
import type { Payment, User } from "@prisma/client";
import { Link } from "@remix-run/react";
import type { FC } from "react";
import { formatDateTime } from "~/utils/date/format";

type Props = {
  payments: Payment[];
  users: User[];
  setCurData: (id: string) => void;
};

export const PaymentCardList: FC<Props> = (props) => {
  const { payments, users, setCurData } = props;
  const total = payments.reduce((total, curVal) => total + curVal.value, 0);
  let curDate = "";
  const monthlyTotal = 1000;
  const budget = 100;

  return (
    <Box>
      <Box
        display="grid"
        sx={{
          gridTemplateColumns: "64px 1fr",
          gridTemplateRows: "repeat(2, 1fr)",
        }}
      >
        <Text>残高</Text>
        <Text>{budget.toLocaleString()}</Text>
        <Text>月合計</Text>
        <Text>{monthlyTotal.toLocaleString()}</Text>
      </Box>
      {payments.map((payment) => {
        const formatPayDate = formatDateTime(payment.payDate, "YYYY年MM月DD日");
        const isSameDate = curDate === formatPayDate;
        curDate = formatPayDate;
        return (
          <Box
            key={`payment ${curDate} ${payment.id}`}
            onClick={() => setCurData(payment.id)}
          >
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
            <Box
              display="grid"
              sx={{ gridTemplateColumns: "repeat(3, 1fr)" }}
              // component={Link}
              // to={`/detail/${payment.id}`}
            >
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
