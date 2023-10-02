import { Alert, Box, Button, Select, Stack, TextInput } from "@mantine/core";
import type { LoaderArgs } from "@remix-run/node";
import { Form, Outlet } from "@remix-run/react";
import { useEffect, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { AppBar } from "~/components/AppBar";
import { userCookie } from "~/cookie.server";
import { getAllUsers } from "~/models/user.server";

export const loader = async ({ request }: LoaderArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const { user: userId } = await userCookie.parse(cookieHeader);
  const users = await getAllUsers();
  return typedjson({
    userId,
    users,
  });
};

const AppLayout = () => {
  const { userId, users } = useTypedLoaderData<typeof loader>();
  const usersForSelect = users.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const [init, setInit] = useState(false);
  useEffect(() => {
    setInit(true);
  }, []);
  if (!init) {
    return <></>;
  }

  return (
    <Box sx={{ backgroundColor: "#c8c8c8" }}>
      <AppBar userId={userId}>
        {userId ? (
          <Outlet />
        ) : (
          <Box m="auto" maw="365px" sx={{ gap: "8px" }} pt="8px">
            <Alert variant="light" color="blue" icon={<AiOutlineInfoCircle />}>
              アプリケーションを利用するためには
              <br />
              ログインしてください
            </Alert>
            <Form method="POST">
              <Stack spacing="8px">
                <Select
                  name="userId"
                  label="ユーザー"
                  data={usersForSelect}
                ></Select>
                <TextInput name="password" label="パスワード" />
                <Button type="submit">ログイン</Button>
              </Stack>
            </Form>
          </Box>
        )}
      </AppBar>
    </Box>
  );
};

export default AppLayout;
