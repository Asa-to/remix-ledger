import { Box, Button, Stack } from "@mantine/core";
import { LoaderArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { FC } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { CoverArea } from "~/components/CoverArea";
import { PaymentHeader } from "~/components/PaymentHeader";
import { UserPaymentHeader } from "~/components/UserPaymentHeader";
import { userCookie } from "~/cookie.server";
import {
  getPaymentByDateRange,
  getUesrPaymentByDateRange,
} from "~/models/payment.server";
import { getUser } from "~/models/user.server";
import { getFirstDayOfMonth } from "~/utils/date/getFirstDayOfMonth";
import { getLastDayOfMonth } from "~/utils/date/getLastDataOfMonth";

export const loader = async ({ request }: LoaderArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const userId = await userCookie.parse(cookieHeader);
  const user = await getUser(userId?.userId);
  const payments = await getPaymentByDateRange(
    getFirstDayOfMonth(new Date()),
    getLastDayOfMonth(new Date()),
  );
  const userPayments = await getUesrPaymentByDateRange(
    getFirstDayOfMonth(new Date()),
    getLastDayOfMonth(new Date()),
  );

  return typedjson({
    user,
    payments,
    userId: userId?.userId,
    userPayments,
  });
};

const App: FC = () => {
  const { userId, payments, user, userPayments } =
    useTypedLoaderData<typeof loader>();

  if (!user) {
    return <> </>;
  }

  return (
    <Stack m="16px">
      <CoverArea title="グループ">
        <Box mb="16px">
          <PaymentHeader date={new Date()} payments={payments} user={user} />
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gridRowGap: "16px",
          }}
        >
          <Button
            component={Link}
            to="payment"
            variant="outline"
            sx={{ width: "150px" }}
          >
            家計簿を見る
          </Button>
          <Button
            component={Link}
            to="payment/create"
            variant="outline"
            sx={{ width: "150px" }}
          >
            入出金を登録する
          </Button>
        </Box>
      </CoverArea>
      <CoverArea title="個人">
        <UserPaymentHeader userPayments={userPayments} date={new Date()} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gridRowGap: "16px",
          }}
        >
          <Button
            component={Link}
            to={`user/${userId}`}
            variant="outline"
            sx={{ width: "150px" }}
          >
            家計簿を見る
          </Button>
          <Button
            component={Link}
            to={`user/${userId}/create`}
            variant="outline"
            sx={{ width: "150px" }}
          >
            入出金を登録する
          </Button>
        </Box>
      </CoverArea>
    </Stack>
  );
};

export default App;
