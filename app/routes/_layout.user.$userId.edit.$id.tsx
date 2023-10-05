import {
  Button,
  Grid,
  Group,
  Input,
  Radio,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import type { ActionArgs } from "@remix-run/node";
import { Form, useLocation, useNavigate } from "@remix-run/react";
import {
  getUserCategories,
  getUserPayment,
  updateUserPayment,
} from "~/models/payment.server";
import type { LoaderArgs } from "@remix-run/node";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { useState } from "react";

export const loader = async ({ params }: LoaderArgs) => {
  const categories = (await getUserCategories()).map((v) => v.category);
  const payment = await getUserPayment(params.id as string);

  if (!payment) {
    return redirect("/payment");
  }

  return typedjson({ categories, payment });
};

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  const redirectTo = body.get("redirectTo")?.toString();

  await updateUserPayment(body.get("id") as string, {
    payDate: body.get("payDate") as string,
    category: body.get("category") as string,
    value: Number(body.get("value")) * (body.get("type") === "1" ? 1 : -1),
    remarks: body.get("remarks") as string,
  });

  if (redirectTo) {
    return redirect(redirectTo);
  }
};

export const PaymentCreate = () => {
  const { categories: baseCategories, payment } =
    useTypedLoaderData<typeof loader>();
  const [categories, setCategories] = useState<typeof baseCategories>(
    Array.from(new Set(baseCategories))
  );
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const location = useLocation();
  const redirectTo = location.state?.from ?? "/payment";

  return (
    <Form method="POST">
      <Stack spacing={8}>
        <input name="redirectTo" defaultValue={redirectTo} hidden />
        <Input display="none" name="id" defaultValue={payment.id} />
        <DateInput
          label="支払日"
          name="payDate"
          valueFormat="YYYY年MM月DD日"
          required
          defaultValue={payment.payDate}
        />
        <Grid>
          <Grid.Col span="auto">
            <Select
              data={categories ?? []}
              label="カテゴリー"
              name="category"
              getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(query) => {
                setCategories((categories) => [query, ...categories]);
                return query;
              }}
              required
              defaultValue={payment.category}
              creatable
              searchable
            />
          </Grid.Col>
          <Grid.Col span="content">
            <Radio.Group
              label="収支選択"
              name="type"
              required
              defaultValue={payment.value < 0 ? "0" : "1"}
            >
              <Group>
                <Radio value="0" label="支出" />
                <Radio value="1" label="収入" />
              </Group>
            </Radio.Group>
          </Grid.Col>
        </Grid>
        <TextInput
          label="収支"
          type="number"
          name="value"
          required
          pattern="^[0-9]+$"
          defaultValue={Math.abs(payment.value).toString()}
        />
        <TextInput
          label="備考"
          name="remarks"
          defaultValue={payment.remarks?.toString()}
        />
        <Stack sx={{ flexDirection: "row" }}>
          <Button onClick={goBack}>戻る</Button>
          <Button type="submit">更新</Button>
        </Stack>
      </Stack>
    </Form>
  );
};

export default PaymentCreate;
