import { type FC } from "react";
import { Button, Text, Stack, useMantineTheme, Box } from "@mantine/core";
import { getPaymentByDateRange } from "~/models/payment.server";
import { getAllUsers } from "~/models/user.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { formatDateTime } from "~/utils/date/formatDateTime";
import { Link } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { getFirstDayOfMonth } from "~/utils/date/getFirstDayOfMonth";
import { getLastDayOfMonth } from "~/utils/date/getLastDataOfMonth";
import { PaymentCard } from "~/components/PaymentCard";

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

  if (payments.length === 0) {
    return <Text>この月はデータがありません</Text>;
  }

  const total = payments
    .reduce((total, curVal) => total + curVal.value, 0)
    .toLocaleString();

  let curDate: null | number = null;
  return (
    <Stack spacing={0}>
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
      <Button component={Link} to="create">
        収支入力
      </Button>
    </Stack>
  );
};

export default App;
