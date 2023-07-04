import type { FC } from "react";
import { useState } from "react";
import {
  Button,
  Grid,
  Group,
  Modal,
  Radio,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { createPayment, getAllPayments } from "~/models/payment.server";
import { getAllUsers } from "~/models/user.server";
import { PaymentCard } from "~/components/PaymentCard";

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
  console.log(new Date(body.get("payDate") as string));
  const payment = await createPayment({
    payDate: new Date(
      new Date(body.get("payDate") as string).getTime() +
        (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
    ),
    category: body.get("category") as string,
    value: Number(body.get("value")) * (body.get("type") === "1" ? -1 : 1),
    userId: body.get("userId") as string,
    remarks: body.get("remarks") as string,
  });
  return payment;
}

const App: FC = () => {
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
      <PaymentCard payments={payments} users={users} />
      <Button onClick={open}>収支入力</Button>
      <Modal opened={opened} onClose={close} title="収支入力">
        <Form method="POST" onReset={close} onSubmit={close}>
          <Stack spacing={8}>
            <DateInput
              label="支払日"
              name="payDate"
              required
              defaultValue={new Date()}
            />
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
            <TextInput label="収支" type="number" name="value" required />
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

export default App;
