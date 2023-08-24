import {
  Button,
  Text,
  Flex,
  List,
  Stack,
  TextInput,
  Group,
} from "@mantine/core";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useLocation } from "@remix-run/react";
import type { FC } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { deleteUser, getAllUsers } from "~/models/user.server";

type LoaderData = {
  users: Awaited<ReturnType<typeof getAllUsers>>;
};
export const loader: LoaderFunction = async () => {
  const users = await getAllUsers();
  return json({ users });
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

const UserPage: FC = () => {
  const { users } = useLoaderData<LoaderData>();
  const location = useLocation();
  const pathname = location.pathname;
  const search = location.search;

  return (
    <Stack>
      <List>
        {users.map((user) => {
          return (
            <List.Item key={`user ${user.id}`}>
              <Group>
                <Button
                  p={0}
                  component={Link}
                  to={`/user/delete/${user.id}`}
                  variant="subtle"
                  sx={{ height: "fit-content" }}
                  state={{ from: pathname + search }}
                >
                  <Flex direction="row" align="center" gap="4px">
                    <AiOutlineDelete />
                    <Text sx={{ whiteSpace: "nowrap" }}>削除</Text>
                  </Flex>
                </Button>
                <Text>{user.name}</Text>
              </Group>
            </List.Item>
          );
        })}
      </List>
      <Form method="POST">
        <Stack>
          <TextInput name="name" />
          <Button type="submit">作成</Button>
        </Stack>
      </Form>
    </Stack>
  );
};

export default UserPage;
