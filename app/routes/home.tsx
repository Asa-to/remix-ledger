import type { FC } from "react";
import { useState } from "react";
import {
  Button,
  Grid,
  Group,
  List,
  Modal,
  Radio,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { Form, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { createPayment, getAllPayments } from "~/models/payment.server";
import { getAllUsers } from "~/models/user.server";

type LoaderData = {
  payments: Awaited<ReturnType<typeof getAllPayments>>;
  users: Awaited<ReturnType<typeof getAllUsers>>;
};
export const loader: LoaderFunction = async () => {
  const payments = await getAllPayments();
  const users = await getAllUsers();
  return json({ payments, users });
};

export async function action({ request }: ActionArgs) {
  const body = await request.formData();
  const payment = await createPayment({
    category: body.get("category") as string,
    type: Number(body.get("type")),
    value: Number(body.get("value")),
    userId: body.get("userId") as string,
    remarks: body.get("remarks") as string,
  });
  return payment;
}

const Home: FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { payments, users } = useLoaderData<LoaderData>();
  const [categories, setCategories] = useState(
    Array.from(new Set(payments.map((item) => item.category)))
  );
  const usersForSelect = users.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <Stack>
      <List>
        {payments.map((payment) => {
          return (
            <List.Item key={`payment item ${payment.id}`}>
              {payment.category}
            </List.Item>
          );
        })}
      </List>
      <Button onClick={open}>収支入力</Button>
      <Modal opened={opened} onClose={close} title="収支入力">
        <Form method="POST" onReset={close} onSubmit={close}>
          <Stack spacing={8}>
            <DateInput label="支払日" name="payDate" required />
            <Grid>
              <Grid.Col span="auto">
                <Select
                  data={categories}
                  label="カテゴリー"
                  name="category"
                  getCreateLabel={(query) => `+ Create ${query}`}
                  onCreate={(query) => {
                    setCategories((categories) => [query, ...categories]);
                    return query;
                  }}
                  required
                  defaultValue={categories[0]}
                  creatable
                  searchable
                />
              </Grid.Col>
              <Grid.Col span="content">
                <Radio.Group
                  label="収支選択"
                  name="type"
                  required
                  defaultValue="0"
                >
                  <Group>
                    <Radio value="0" label="収入" />
                    <Radio value="1" label="支出" />
                  </Group>
                </Radio.Group>
              </Grid.Col>
            </Grid>
            <Select
              name="userId"
              data={usersForSelect}
              label="支払い者"
              defaultValue={usersForSelect[0].value}
              required
            />
            <TextInput label="収支" type="number" required />
            <TextInput label="備考" name="remarks" />
            <Stack sx={{ flexDirection: "row" }}>
              <Button type="reset">キャンセル</Button>
              <Button type="submit">決定</Button>
            </Stack>
          </Stack>
        </Form>
      </Modal>
    </Stack>
  );
};

export default Home;
