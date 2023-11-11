import { Button, Checkbox, Group, Stack, Text } from "@mantine/core";
import type { ActionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { deleteToBuys, getAllToBuy } from "~/models/tobuy.server";

export const loader = async () => {
  const toBuyList = await getAllToBuy();
  return typedjson({ toBuyList });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const ids = formData.getAll("id").map((item) => item.toString());
  await deleteToBuys(ids);

  return null;
};

const ToBuyPage = () => {
  const { toBuyList } = useTypedLoaderData<typeof loader>();

  return (
    <Form method="POST">
      <Stack spacing="md">
        <Stack spacing={0}>
          {toBuyList.map((toBuy) => {
            return (
              <Group key={toBuy.id}>
                <Group spacing="xs">
                  {"-"}
                  <Checkbox color="red" name="id" value={toBuy.id} />
                </Group>
                <Text>{toBuy.name}</Text>
              </Group>
            );
          })}
        </Stack>
        <Group spacing="md">
          <Button type="submit" color="orange">
            削除
          </Button>
          <Button component={Link} to="/toBuy/create">
            新規作成
          </Button>
        </Group>
      </Stack>
    </Form>
  );
};

export default ToBuyPage;
