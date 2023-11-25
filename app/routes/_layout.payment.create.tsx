import {
  Button,
  Grid,
  Group,
  LoadingOverlay,
  MultiSelect,
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
import { getNow } from "~/utils/date/getNow";
import { userCookie } from "~/cookie.server";
import { deleteToBuys, getAllToBuy } from "~/models/tobuy.server";

export const loader = async ({ request }: LoaderArgs) => {
  const categories = (await getCategories()).map((item) => item.category);
  const users = await getAllUsers();
  const cookieHeader = request.headers.get("Cookie");
  const userId = await userCookie.parse(cookieHeader);
  const toBuyList = await getAllToBuy();
  return typedjson({
    categories,
    users,
    toBuyList,
    myUserId: userId?.userId as string | undefined,
  });
};

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  const redirectTo = body.get("redirectTo")?.toString();

  await createPayment({
    payDate: body.get("payDate")?.toString() ?? "",
    category: body.get("category")?.toString() ?? "",
    value: Number(body.get("value")) * (body.get("type") === "1" ? 1 : -1),
    userId: body.get("userId")?.toString() ?? "",
    remarks: body.get("remarks")?.toString() ?? "",
    payPer: Number(body.get("payPer")),
  });

  const toBuyList = body.getAll("toBuyList").map((item) => item.toString());
  if (toBuyList[0]) {
    await deleteToBuys(toBuyList);
  }

  if (redirectTo) {
    return redirect(redirectTo);
  }
};

export const PaymentCreate = () => {
  const {
    categories: baseCategories,
    users,
    myUserId,
    toBuyList,
  } = useTypedLoaderData<typeof loader>();
  const usersForSelect = users.map((item) => ({
    label: item.name,
    value: item.id,
  }));
  const toBuyListForSelect = toBuyList.map((item) => ({
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
    <Form method="POST" onSubmit={toggle}>
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <Stack spacing={8}>
        <input name="redirectTo" defaultValue={redirectTo} hidden />
        <DateInput
          label="支払日"
          name="payDate"
          valueFormat="YYYY年MM月DD日"
          required
          defaultValue={getNow()}
        />
        <Select
          name="userId"
          data={usersForSelect}
          label="ユーザー"
          defaultValue={myUserId ?? usersForSelect[0].value}
          required
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
        <TextInput
          label="支払い者の負担割合（％）"
          type="text"
          name="payPer"
          defaultValue={50}
          required
          pattern="^[0-9]{2}|100"
        />
        <TextInput
          label="収支"
          type="text"
          name="value"
          inputMode="numeric"
          required
          pattern="^[0-9]+$"
          autoFocus
        />
        <TextInput label="備考" name="remarks" />
        <MultiSelect
          data={toBuyListForSelect}
          name="toBuyList"
          label="買い物リストから購入したもの"
        />
        <Stack sx={{ flexDirection: "row" }}>
          <Button onClick={goBack}>戻る</Button>
          <Button type="submit">決定</Button>
        </Stack>
      </Stack>
    </Form>
  );
};

export default PaymentCreate;
