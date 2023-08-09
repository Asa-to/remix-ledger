import { Button, Group, Stack, Title } from "@mantine/core";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useLocation, useNavigate } from "@remix-run/react";
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
  const formData = await request.formData();
  const id = formData.get("id") as string;
  const redirectTo = formData.get("redirectTo")?.toString();
  await deletePayment(id);

  if (redirectTo) {
    return redirect(redirectTo);
  }
};

const PaymentDelete = () => {
  const { payment } = useTypedLoaderData<typeof loader>();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const location = useLocation();
  const redirectTo = location.state?.from ?? "/payment";

  if (!payment) {
    return (
      <Stack>
        <Title order={4}>データが正常に取得できませんでした</Title>
        <Button onClick={goBack}>戻る</Button>
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
        <input name="redirectTo" defaultValue={redirectTo} hidden />
        <Group spacing={8}>
          <Button variant="outline" onClick={goBack}>
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
