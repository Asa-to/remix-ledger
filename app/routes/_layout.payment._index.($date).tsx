import { type FC } from "react";
import { Button, Text, Stack, Box, Group, Title, Flex } from "@mantine/core";
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
import { generateCSV } from "~/utils/csv/generateCSV";
import type { Payment } from "@prisma/client";
import { PaymentHeader } from "~/components/PaymentHeader";
import { userCookie } from "~/cookie.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const date = params.date ? new Date(params.date) : getNow();
  const payments = await getPaymentByDateRange(
    getFirstDayOfMonth(date),
    getLastDayOfMonth(date),
  );
  const users = await getAllUsers();
  const cookieHeader = request.headers.get("Cookie");
  const myId = await userCookie.parse(cookieHeader);
  return typedjson({ payments, users, myId: myId?.userId });
};

const App: FC = () => {
  const { payments, users, myId } = useTypedLoaderData<typeof loader>();
  const pathName = useLocation().pathname.split("/").pop();
  const date = new Date(pathName ?? "")?.getTime()
    ? new Date(pathName ?? "")
    : payments?.[0]?.payDate || getNow();
  const location = useLocation();
  const pathname = location.pathname;
  const search = location.search;

  let curDate: null | number = null;

  return (
    <Stack spacing={4}>
      <PaymentHeader
        date={date}
        payments={payments}
        user={users.filter((v) => v.id === myId)[0]}
      />
      <Button
        component={Link}
        to="/payment/create"
        state={{ from: pathname + search }}
        variant="gradient"
      >
        収支入力
      </Button>
      <Flex direction="row" justify="space-between" px="8px">
        <Group>
          <Button
            component={Link}
            to={`/payment/${formatDateTime(
              getDateByMonthDifference(date, -1),
              "YYYY-MM-DD",
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
              "YYYY-MM-DD",
            )}`}
            variant="subtle"
          >
            {getDateByMonthDifference(date, 1).getMonth() + 1}月 ＞
          </Button>
        </Group>
        <Button variant="outline" size="xs">
          <Link
            to={encodeURI(generateCSV<Payment[]>(payments))}
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
                (item) => item.value < 0 && item.payDate.getDate() === curDate,
              )
              .reduce((pre, cur) => pre + cur.value, 0),
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
              <PaymentCard
                payment={item}
                users={users}
                editLink={`/payment/edit/${item.id}`}
                deleteLink={`/payment/delete/${item.id}`}
              />
            </Stack>
          );
        })}
      </Box>
    </Stack>
  );
};

export default App;
