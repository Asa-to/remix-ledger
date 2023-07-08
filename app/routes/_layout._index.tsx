import type { FC } from "react";
import { Box, Button, Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { createPayment, getAllPayments } from "~/models/payment.server";
import { getAllUsers } from "~/models/user.server";
import { PaymentCard } from "~/components/PaymentCard";
import { PaymentCreate } from "~/components/PaymentCard/create";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderArgs) => {
  const payments = await getAllPayments();
  const users = await getAllUsers();
  return typedjson({ payments, users });
};

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();
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
};

const App: FC = () => {
  const { payments, users } = useTypedLoaderData<typeof loader>();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Stack>
      <PaymentCard payments={payments} users={users} />
      <Button onClick={open}>収支入力</Button>
      <Modal
        opened={opened}
        onClose={close}
        title="収支入力"
        styles={{ inner: { boxSizing: "border-box" } }}
      >
        <PaymentCreate payments={payments} users={users} close={close} />
      </Modal>
    </Stack>
  );
};

export default App;
