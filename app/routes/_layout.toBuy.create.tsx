import { Button, LoadingOverlay, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ActionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { redirect } from "remix-typedjson";
import { MultiInput } from "~/components/MultiInput";
import { createToBuys } from "~/models/tobuy.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const name = formData
    .getAll("name")
    .map((item) => ({ name: item.toString() }));
  name && (await createToBuys(name));

  return redirect("/toBuy");
};

const ToBuyCreate = () => {
  const [visible, { toggle }] = useDisclosure(false);

  return (
    <Form method="POST" onSubmit={toggle}>
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <Stack>
        <MultiInput name="name" require />
        <Button type="submit" disabled={visible}>
          登録
        </Button>
      </Stack>
    </Form>
  );
};

export default ToBuyCreate;
