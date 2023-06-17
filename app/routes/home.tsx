import type { FC } from "react";
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
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";

const Home: FC = () => {
  const form = useForm();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Stack>
      <List>
        <List.Item>支払い情報 1</List.Item>
        <List.Item>支払い情報 2</List.Item>
        <List.Item>支払い情報 3</List.Item>
      </List>
      <Button onClick={open}>収支入力</Button>
      <Modal opened={opened} onClose={close} title="収支入力">
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Stack spacing={8}>
            <TextInput {...form.getInputProps("title")} label="タイトル" />
            <DateInput {...form.getInputProps("date")} label="支払日" />
            <Grid>
              <Grid.Col span="auto">
                <Select
                  {...form.getInputProps("types")}
                  data={["食費", "日用品"]}
                  label="カテゴリー"
                />
              </Grid.Col>
              <Grid.Col span="content">
                <Radio.Group
                  {...form.getInputProps("isIncome")}
                  label="収支選択"
                >
                  <Group>
                    <Radio value="0" label="収入" />
                    <Radio value="1" label="支出" />
                  </Group>
                </Radio.Group>
              </Grid.Col>
            </Grid>
            <Select
              {...form.getInputProps("user")}
              data={["あさと", "はるか"]}
              label="支払い者"
            />
            <TextInput {...form.getInputProps("payment")} label="収支" />
            <Stack sx={{ flexDirection: "row" }}>
              <Button type="reset">キャンセル</Button>
              <Button type="submit">決定</Button>
            </Stack>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
};

export default Home;
