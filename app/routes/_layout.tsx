import { Alert, Box, Button, Stack, TextInput } from "@mantine/core";
import type { LoaderArgs } from "@remix-run/node";
import { Form, Outlet } from "@remix-run/react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { AppBar } from "~/components/AppBar";
import { isLoginCookie } from "~/cookie.server";

export const loader = async ({ request }: LoaderArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const isLogin = await isLoginCookie.parse(cookieHeader);
  console.log(isLogin);
  return typedjson({
    isLogin,
  });
};

const AppLayout = () => {
  const { isLogin } = useTypedLoaderData<typeof loader>();

  return (
    <Box sx={{ backgroundColor: "#c8c8c8" }}>
      <AppBar>
        {isLogin ? (
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
