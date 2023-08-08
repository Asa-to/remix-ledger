import { type FC } from "react";
import { Button, Text, Stack, Box, Group, Title } from "@mantine/core";
import { getPaymentByDateRange } from "~/models/payment.server";
import { getAllUsers } from "~/models/user.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { formatDateTime } from "~/utils/date/formatDateTime";
import { Link, useLocation } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { getFirstDayOfMonth } from "~/utils/date/getFirstDayOfMonth";
import { getLastDayOfMonth } from "~/utils/date/getLastDataOfMonth";
import { PaymentCard } from "~/components/PaymentCard";
import { getDateByMonthDifference } from "~/utils/date/getDatebyMonthDifference";

export const loader = async ({ params }: LoaderArgs) => {
  const date = params.date ? new Date(params.date) : new Date();
  const payments = await getPaymentByDateRange(
    getFirstDayOfMonth(date),
    getLastDayOfMonth(date)
  );
  const users = await getAllUsers();
  return typedjson({ payments, users });
};

const App: FC = () => {
  const { payments, users } = useTypedLoaderData<typeof loader>();
  const pathName = useLocation().pathname.split("/").pop();
  const date = new Date(pathName ?? "")?.getTime()
    ? new Date(pathName ?? "")
    : payments?.[0]?.payDate || new Date();

  const total = payments
    .reduce((total, curVal) => total + curVal.value, 0)
    .toLocaleString();
  const totalExpense = payments
    .filter((item) => item.value < 0)
    .reduce((total, curVal) => total + curVal.value, 0);
  const halfExpense = totalExpense / 2;

  let curDate: null | number = null;

  return (
    <Stack spacing={4}>
      <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr" }}>
        <Text>{date.getMonth() + 1}月総資産</Text>
        <Text>{total}</Text>
      </Box>
      <Stack spacing={0}>
        {users.map((user) => {
          const usersData = payments.filter((item) => item.userId === user.id);
          const userTotalExpense = usersData
            .filter((item) => item.value < 0)
            .reduce((total, item) => total + item.value, 0);
          const userTotalIncome = usersData
            .filter((item) => 0 < item.value)
            .reduce((total, item) => total + item.value, 0);
          const calcResult = halfExpense - userTotalExpense - userTotalIncome;
          return (
            <Box
              sx={{ display: "grid", gridTemplateColumns: "120px 80px 1fr" }}
              key={user.id}
            >
              <Text>{user.name}</Text>
              <Text>{calcResult.toLocaleString()}</Text>
              <Text>
                {calcResult === 0
                  ? ""
                  : 0 < calcResult
                  ? "円受け取る"
                  : "円渡す"}
              </Text>
            </Box>
          );
        })}
      </Stack>
      <Group>
        <Button
          component={Link}
          to={`/payment/${formatDateTime(
            getDateByMonthDifference(date, -1),
            "YYYY-MM-DD"
          )}`}
          variant="subtle"
        >
          ＜ {getDateByMonthDifference(date, -1).getMonth() + 1}月
        </Button>
        <Title size="h4">{date.getMonth() + 1}月</Title>
        <Button
          component={Link}
          to={`/payment/${formatDateTime(
            getDateByMonthDifference(date, 1),
            "YYYY-MM-DD"
          )}`}
          variant="subtle"
        >
          {getDateByMonthDifference(date, 1).getMonth() + 1}月 ＞
        </Button>
      </Group>
      <Box>
        {payments.map((item) => {
          const showDate = curDate !== item.payDate.getDate();
          curDate = item.payDate.getDate();
          return (
            <Stack
              key={item.id}
              spacing={0}
              sx={{ borderTop: !showDate ? "1px solid" : undefined }}
            >
              {showDate && (
                <Text bg="gray">
                  {formatDateTime(item.payDate, "YYYY年MM月DD日")}
                </Text>
              )}
              <PaymentCard payment={item} users={users} />
            </Stack>
          );
        })}
      </Box>
      <Button component={Link} to="/payment/create">
        収支入力
      </Button>
    </Stack>
  );
};

export default App;
