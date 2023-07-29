import {
  Button,
  Grid,
  Group,
  Radio,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import type { Payment, User } from "@prisma/client";
import { Form } from "@remix-run/react";
import type { FC } from "react";
import { useState } from "react";

type Props = {
  payments: Payment[];
  users: User[];
  initialValue?: Payment;
  close: () => void;
};

export const PaymentCreate: FC<Props> = (props) => {
  const { payments, users, close, initialValue } = props;
  const [categories, setCategories] = useState(
    Array.from(new Set(payments.map((item) => item.category)))
  );
  const usersForSelect = users.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <Form method="POST" onReset={close} onSubmit={close}>
      <Stack spacing={8}>
        <DateInput
          label="支払日"
          name="payDate"
          valueFormat="YYYY年MM月DD日"
          required
          defaultValue={initialValue?.payDate ?? new Date()}
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
              defaultValue={initialValue?.category ?? categories[0]}
              creatable
              searchable
            />
          </Grid.Col>
          <Grid.Col span="content">
            <Radio.Group
              label="収支選択"
              name="type"
              required
              defaultValue={(initialValue?.value ?? 0) < 0 ? "0" : "1"}
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
          label="支払い者"
          defaultValue={initialValue?.userId ?? usersForSelect[0].value}
          required
        />
        <TextInput
          label="収支"
          type="number"
          name="value"
          defaultValue={initialValue && Math.abs(initialValue.value)}
          required
        />
        <TextInput
          label="備考"
          name="remarks"
          defaultValue={initialValue?.remarks ?? ""}
        />
        <Stack sx={{ flexDirection: "row" }}>
          <Button type="reset">キャンセル</Button>
          <Button type="submit">決定</Button>
        </Stack>
      </Stack>
    </Form>
  );
};
