import { Fragment, type FC, useState } from "react";
import { Button, Text, Stack, Box, Group, Title, Select } from "@mantine/core";
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
import { getNow } from "~/utils/date/getNow";

export const loader = async ({ params }: LoaderArgs) => {
  const date = params.date ? new Date(params.date) : getNow();
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
    : payments?.[0]?.payDate || getNow();
  const location = useLocation();
  const pathname = location.pathname;
  const search = location.search;

  const totalExpense = Math.abs(
    payments
      .filter((item) => item.value < 0)
      .reduce((total, curVal) => total + curVal.value, 0)
  );
  const halfExpense = totalExpense / 2;

  const categories = Array.from(new Set(payments.map((item) => item.category)));
  const [curCategory, setCurCategory] = useState<string | null>(categories[0]);
  const curCategorySum = payments
    .filter((item) => item.category === curCategory)
    .reduce((pre, cur) => pre + cur.value, 0);

  let curDate: null | number = null;

  return (
    <Stack spacing={4}>
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
        {users.map((user) => {
          const userData = payments.filter((item) => item.userId === user.id);
          const userTotalExpense = Math.abs(
            userData
              .filter((item) => item.value < 0)
              .reduce((total, item) => total + Math.abs(item.value), 0)
          );
          const userTotalIncome = userData
            .filter((item) => 0 < item.value)
            .reduce((pre, cur) => pre + cur.value, 0);
          const calcResult = halfExpense - userTotalExpense - userTotalIncome;
          const isPayOver = calcResult < 0;
          return (
            <Fragment key={user.id}>
              <Text>{user.name}</Text>
              <Text>{Math.abs(calcResult).toLocaleString()}</Text>
              <Text>{isPayOver ? "円受け取る" : "円渡す"}</Text>
            </Fragment>
          );
        })}
        <Select
          value={curCategory}
          data={categories}
          onChange={setCurCategory}
        />
        <Text>{Math.abs(curCategorySum)}</Text>
        <Text>円</Text>
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
        variant="gradient"
      >
        収支入力
      </Button>
    </Stack>
  );
};

export default App;
