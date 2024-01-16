import { Button, Stack } from "@mantine/core";
import { getEndOfWeek } from "@mantine/dates";
import { LoaderArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { FC } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { PaymentHeader } from "~/components/PaymentHeader";
import { userCookie } from "~/cookie.server";
import { getPaymentByDateRange } from "~/models/payment.server";
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

  return typedjson({
    user,
    payments,
    userId,
  });
};

const App: FC = () => {
  const { userId, payments, user } = useTypedLoaderData<typeof loader>();

  return (
    <Stack m="16px">
      {user && (
        <PaymentHeader date={new Date()} payments={payments} user={user} />
      )}
      <Button
        component={Link}
        to="payment"
        variant="outline"
        sx={{ width: "150px" }}
      >
        家計簿へ
      </Button>
      <Button
        component={Link}
        to="payment/create"
        variant="outline"
        sx={{ width: "150px" }}
      >
        あさはる登録
      </Button>
      {user && (
        <Button
          component={Link}
          to={`user/${userId}/create`}
          variant="outline"
          sx={{ width: "150px" }}
        >
          {user.name}登録
        </Button>
      )}
    </Stack>
  );
};

export default App;
