import { Button, Stack } from "@mantine/core";
import { LoaderArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { FC } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { userCookie } from "~/cookie.server";
import { getUser } from "~/models/user.server";

export const loader = async ({ request }: LoaderArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const userId = await userCookie.parse(cookieHeader);
  const userName = (await getUser(userId?.userId))?.name ?? "不明なユーザー";

  return typedjson({
    userName,
    userId,
  });
};

const App: FC = () => {
  const { userName, userId } = useTypedLoaderData<typeof loader>();

  return (
    <Stack m="16px">
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
      <Button
        component={Link}
        to={`user/${userId}/create`}
        variant="outline"
        sx={{ width: "150px" }}
      >
        {userName}登録
      </Button>
    </Stack>
  );
};

export default App;
