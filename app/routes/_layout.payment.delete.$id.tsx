import { Button, Group, Stack, Title } from "@mantine/core";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { LabelValueItem } from "~/components/LabelValueItem";
import { deletePayment, getPayment } from "~/models/payment.server";
import { formatDateTime } from "~/utils/date/formatDateTime";

export const loader = async ({ params }: LoaderArgs) => {
  const { id } = params;
  const payment = await getPayment(id as string);
  return typedjson({ payment });
};

export const action = async ({ request }: ActionArgs) => {
  const id = (await request.formData()).get("id") as string;
  await deletePayment(id);

  return redirect("/payment");
};

const PaymentDelete = () => {
  const { payment } = useTypedLoaderData<typeof loader>();

  if (!payment) {
    return (
      <Stack>
        <Title order={4}>データが正常に取得できませんでした</Title>
        <Button component={Link} to="/payment">
          戻る
        </Button>
      </Stack>
    );
  }

  return (
    <Stack>
      <Title order={4}>以下のデータを削除してもよろしいですか？</Title>
      <LabelValueItem
        label="日付"
        value={formatDateTime(payment.payDate, "YYYY年MM月DD日")}
      />
      <LabelValueItem label="金額" value={payment.value.toString()} />
      <LabelValueItem label="カテゴリー" value={payment.category} />
      <Form method="POST">
        <input name="id" defaultValue={payment.id} hidden />
        <Group spacing={8}>
          <Button variant="outline" component={Link} to="/payment">
            戻る
          </Button>
          <Button type="submit" color="orange">
            削除
          </Button>
        </Group>
      </Form>
    </Stack>
  );
};

export default PaymentDelete;
