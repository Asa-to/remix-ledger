import {
  Button,
  Grid,
  Group,
  LoadingOverlay,
  Radio,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import type { ActionArgs } from "@remix-run/node";
import { Form, useLocation, useNavigate } from "@remix-run/react";
import { createPayment, getCategories } from "~/models/payment.server";
import type { LoaderArgs } from "@remix-run/node";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { getAllUsers } from "~/models/user.server";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

export const loader = async ({ request }: LoaderArgs) => {
  const categories = (await getCategories()).map((item) => item.category);
  const users = await getAllUsers();
  return typedjson({ categories, users });
};

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  const redirectTo = body.get("redirectTo")?.toString();

  await createPayment({
    payDate: body.get("payDate") as string,
    category: body.get("category") as string,
    value: Number(body.get("value")) * (body.get("type") === "1" ? 1 : -1),
    userId: body.get("userId") as string,
    remarks: body.get("remarks") as string,
  });

  if (redirectTo) {
    return redirect(redirectTo);
  }
};

export const PaymentCreate = () => {
  const { categories: baseCategories, users } =
    useTypedLoaderData<typeof loader>();
  const usersForSelect = users.map((item) => ({
    label: item.name,
    value: item.id,
  }));
  const [categories, setCategories] = useState<typeof baseCategories>(
    Array.from(new Set(baseCategories))
  );
  const [visible, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const location = useLocation();
  const redirectTo = location.state?.from ?? "/payment";

  return (
    <Form method="POST">
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <Stack spacing={8}>
        <input name="redirectTo" defaultValue={redirectTo} hidden />
        <DateInput
          label="支払日"
          name="payDate"
          valueFormat="YYYY年MM月DD日"
          required
          defaultValue={new Date()}
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
              defaultValue={"0"}
            >
              <Group>
                <Radio value="0" label="支出" />
                <Radio value="1" label="収入" />
              </Group>
            </Radio.Group>
          </Grid.Col>
        </Grid>
        <Select
          name="userId"
          data={usersForSelect}
          label="ユーザー"
          defaultValue={usersForSelect[0].value}
          required
        />
        <TextInput
          label="収支"
          type="text"
          name="value"
          required
          pattern="^[0-9]+$"
        />
        <TextInput label="備考" name="remarks" />
        <Stack sx={{ flexDirection: "row" }}>
          <Button onClick={goBack}>戻る</Button>
          <Button type="submit" onClick={toggle}>
            決定
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
};

export default PaymentCreate;
