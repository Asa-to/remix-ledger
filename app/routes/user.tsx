import { Button, List, Stack, TextInput } from "@mantine/core";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { FC } from "react";
import { createUser, getAllUsers } from "~/models/user.server";

type LoaderData = {
  users: Awaited<ReturnType<typeof getAllUsers>>;
};
export const loader: LoaderFunction = async () => {
  const users = await getAllUsers();
  return json({ users });
};

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  const user = await createUser(body.get("name") as string);

  return user;
};

const UserPage: FC = () => {
  const { users } = useLoaderData<LoaderData>();

  return (
    <Stack>
      <List>
        {users.map((user) => {
          return <List.Item key={`user ${user.id}`}>{user.name}</List.Item>;
        })}
      </List>
      <Form method="POST">
        <TextInput name="name" />
        <Button type="submit">作成</Button>
      </Form>
    </Stack>
  );
};

export default UserPage;
