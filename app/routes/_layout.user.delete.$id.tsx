import { Button, Group, Stack, Title } from "@mantine/core";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useLocation, useNavigate } from "@remix-run/react";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { LabelValueItem } from "~/components/LabelValueItem";
import { deleteUser, getUser } from "~/models/user.server";

export const loader = async ({ params }: LoaderArgs) => {
  const { id } = params;
  const user = await getUser(id as string);
  return typedjson({ user });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const id = formData.get("id") as string;
  const redirectTo = formData.get("redirectTo")?.toString();
  await deleteUser(id);

  if (redirectTo) {
    return redirect(redirectTo);
  }
};

const UserDelete = () => {
  const { user } = useTypedLoaderData<typeof loader>();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const location = useLocation();
  const redirectTo = location.state?.from ?? "/user";

  if (!user) {
    return (
      <Stack>
        <Title order={4}>データが正常に取得できませんでした</Title>
        <Button onClick={goBack}>戻る</Button>
      </Stack>
    );
  }

  return (
    <Stack>
      <Title order={4}>以下のユーザーを削除してもよろしいですか？</Title>
      <LabelValueItem label="名前" value={user.name} />
      <Form method="POST">
        <input name="id" defaultValue={user.id} hidden />
        <input name="redirectTo" defaultValue={redirectTo} hidden />
        <Group spacing={8}>
          <Button variant="outline" onClick={goBack}>
            戻る
          </Button>
          <Button type="submit" color="orange" autoFocus>
            削除
          </Button>
        </Group>
      </Form>
    </Stack>
  );
};

export default UserDelete;
