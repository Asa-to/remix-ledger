import { Button, LoadingOverlay, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ActionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { redirect } from "remix-typedjson";
import { createToBuy } from "~/models/tobuy.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  name && (await createToBuy({ name }));

  return redirect("/toBuy");
};

const ToBuyCreate = () => {
  const [visible, { toggle }] = useDisclosure(false);

  return (
    <Form method="POST" onSubmit={toggle}>
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <Stack>
        {/* TODO: 複数登録できるように */}
        <TextInput name="name" label="買うもの" required />
        <Button type="submit">追加</Button>
      </Stack>
    </Form>
  );
};

export default ToBuyCreate;
