import { Fragment, type FC, useState } from "react";
import {
  Button,
  Text,
  Stack,
  Box,
  Group,
  Title,
  Select,
  Flex,
} from "@mantine/core";
import { getUesrPaymentByDateRange } from "~/models/payment.server";
import { getUser } from "~/models/user.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { formatDateTime } from "~/utils/date/formatDateTime";
import { Link, useLocation } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { getFirstDayOfMonth } from "~/utils/date/getFirstDayOfMonth";
import { getLastDayOfMonth } from "~/utils/date/getLastDataOfMonth";
import { PaymentCard } from "~/components/PaymentCard";
import { getDateByMonthDifference } from "~/utils/date/getDatebyMonthDifference";
import { getNow } from "~/utils/date/getNow";
import { generateCSV } from "~/utils/csv/generateCSV";
import type { Payment, User, UserPayment } from "@prisma/client";

export const loader = async ({ params }: LoaderArgs) => {
  const date = params.date ? new Date(params.date) : getNow();
  const payments = await getUesrPaymentByDateRange(
    getFirstDayOfMonth(date),
    getLastDayOfMonth(date)
  );
  const user = (await getUser(params.userId ?? "")) as User;
  return typedjson({
    user,
    payments,
  });
};

const App: FC = () => {
  const { payments, user } = useTypedLoaderData<typeof loader>();
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
        <Select
          value={curCategory}
          data={categories}
          onChange={setCurCategory}
        />
        <Text>{Math.abs(curCategorySum)}</Text>
        <Text>円</Text>
      </Box>
      <Flex direction="row" justify="space-between" px="8px">
        <Group>
          <Button
            component={Link}
            to={`/user/${user.id}/${formatDateTime(
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
            to={`/user/${user.id}/${formatDateTime(
              getDateByMonthDifference(date, 1),
              "YYYY-MM-DD"
            )}`}
            variant="subtle"
          >
            {getDateByMonthDifference(date, 1).getMonth() + 1}月 ＞
          </Button>
        </Group>
        <Button variant="outline" size="xs">
          <Link
            to={encodeURI(generateCSV<UserPayment[]>(payments))}
            style={{ textDecoration: "none" }}
            download={formatDateTime(date, "YYYY年MM月")}
          >
            CSV export
          </Link>
        </Button>
      </Flex>
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
              <PaymentCard payment={item} />
            </Stack>
          );
        })}
      </Box>
      <Button
        component={Link}
        to={`/user/${user?.id}/create`}
        state={{ from: pathname + search }}
        variant="gradient"
      >
        収支入力
      </Button>
    </Stack>
  );
};

export default App;
