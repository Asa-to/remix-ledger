import { Fragment, type FC } from "react";
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
  const location = useLocation();
  const pathname = location.pathname;
  const search = location.search;

  const totalExpenseAbs = Math.abs(
    payments
      .filter((item) => item.value < 0)
      .reduce((total, curVal) => total + curVal.value, 0)
  );
  const halfExpense = totalExpenseAbs / 2;

  let curDate: null | number = null;

  return (
    <Stack spacing={4}>
      <Box sx={{ display: "grid", gridTemplateColumns: "120px 80px 1fr" }}>
        <Text>{date.getMonth() + 1}月総出費</Text>
        <Text>{totalExpenseAbs}</Text>
        <Text>円</Text>
        {users.map((user) => {
          const usersData = payments.filter((item) => item.userId === user.id);
          const userTotalExpenseAbs = Math.abs(
            usersData.reduce((total, item) => total + Math.abs(item.value), 0)
          );
          const calcResult = halfExpense - userTotalExpenseAbs;
          const isPayOver = calcResult < 0;
          return (
            <Fragment key={user.id}>
              <Text>{user.name}</Text>
              <Text>{Math.abs(calcResult).toLocaleString()}</Text>
              <Text>{isPayOver ? "円受け取る" : "円渡す"}</Text>
            </Fragment>
          );
        })}
      </Box>
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
          const dateSum = Math.abs(
            payments
              .filter(
                (item) => item.value < 0 && item.payDate.getDate() === curDate
              )
              .reduce((pre, cur) => pre + cur.value, 0)
          );
          return (
            <Stack
              key={item.id}
              spacing={0}
              sx={{ borderTop: !showDate ? "1px solid" : undefined }}
            >
              {showDate && (
                <Group bg="gray" sx={{ justifyContent: "space-between" }}>
                  <Text>{formatDateTime(item.payDate, "YYYY年MM月DD日")}</Text>
                  <Text>{dateSum}円</Text>
                </Group>
              )}
              <PaymentCard payment={item} users={users} />
            </Stack>
          );
        })}
      </Box>
      <Button
        component={Link}
        to="/payment/create"
        state={{ from: pathname + search }}
      >
        収支入力
      </Button>
    </Stack>
  );
};

export default App;
