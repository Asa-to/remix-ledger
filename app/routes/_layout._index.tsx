import { Box, Button, Stack } from "@mantine/core";
import { LoaderArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { FC } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { CoverArea } from "~/components/CoverArea";
import { PaymentHeader } from "~/components/PaymentHeader";
import { ClickBurstPurin } from "~/components/PompomPurin/ClickBurstPurin";
import { HappyButton } from "~/components/PompomPurin/HappyButton";
import { PompomPurin } from "~/components/PompomPurin";
import { PopoutPurin } from "~/components/PompomPurin/PopoutPurin";
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
  if (!userId?.userId) {
    return typedjson({
      user,
      payments,
      userId: userId?.userId,
      userPayments: [],
    });
  }
  const userPayments = await getUesrPaymentByDateRange(
    userId?.userId ?? "",
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
    <ClickBurstPurin>
      {/* 画面右上に固定でふわふわ */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 20,
          zIndex: 50,
        }}
      >
        <PompomPurin size={80} />
      </Box>
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
            <PopoutPurin>
              <Button
                component={Link}
                to="payment"
                variant="outline"
                sx={{ width: "150px" }}
              >
                家計簿を見る
              </Button>
            </PopoutPurin>
            <PopoutPurin>
              <Button
                component={Link}
                to="payment/create"
                variant="outline"
                sx={{ width: "150px" }}
              >
                入出金を登録する
              </Button>
            </PopoutPurin>
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
            <PopoutPurin>
              <Button
                component={Link}
                to={`user/${userId}`}
                variant="outline"
                sx={{ width: "150px" }}
              >
                家計簿を見る
              </Button>
            </PopoutPurin>
            <PopoutPurin>
              <Button
                component={Link}
                to={`user/${userId}/create`}
                variant="outline"
                sx={{ width: "150px" }}
              >
                入出金を登録する
              </Button>
            </PopoutPurin>
          </Box>
        </CoverArea>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
          <HappyButton />
        </Box>
      </Stack>
    </ClickBurstPurin>
  );
};

export default App;
