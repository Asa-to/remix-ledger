import { type FC } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { Button, Text, Stack, Table, Flex } from "@mantine/core";
import { getAllPayments } from "~/models/payment.server";
import { getAllUsers } from "~/models/user.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { LabelValueItem } from "~/components/LabelValueItem";
import { formatDateTime } from "~/utils/date/format";
import { Link } from "@remix-run/react";

export const loader = async () => {
  const payments = await getAllPayments();
  const users = await getAllUsers();
  return typedjson({ payments, users });
};

const App: FC = () => {
  const { payments, users } = useTypedLoaderData<typeof loader>();

  const total = payments
    .reduce((total, curVal) => total + curVal.value, 0)
    .toLocaleString();

  const heads = (
    <tr>
      <th>ユーザー</th>
      <th>カテゴリー</th>
      <th>金額</th>
      <th>日付</th>
      <th style={{ textAlign: "center" }}>操作</th>
    </tr>
  );

  const rows = payments.map((payment) => {
    const isIncome = 0 < payment.value;
    const valueColor = isIncome ? "blue" : "red";
    return (
      <tr key={payment.id}>
        <td>
          <Text>{users.find((v) => v.id === payment.userId)?.name}</Text>
        </td>
        <td>
          <Text>{payment.category}</Text>
        </td>
        <td>
          <Text color={valueColor}>{payment.value.toString()}</Text>
        </td>
        <td>
          <Text>{formatDateTime(payment.payDate, "YYYY年MM月DD日")}</Text>
        </td>
        <td>
          <Flex direction="row" gap="4px" justify="center">
            <Button variant="subtle" component={Link} to={`edit/${payment.id}`}>
              <Flex direction="row" align="center" gap="4px">
                <AiOutlineEdit />
                <Text sx={{ whiteSpace: "nowrap" }}>編集</Text>
              </Flex>
            </Button>
            <Button
              component={Link}
              to={`delete/${payment.id}`}
              variant="subtle"
            >
              <Flex direction="row" align="center" gap="4px">
                <AiOutlineEdit />
                <Text sx={{ whiteSpace: "nowrap" }}>削除</Text>
              </Flex>
            </Button>
          </Flex>
        </td>
      </tr>
    );
  });

  return (
    <Stack spacing={1}>
      <LabelValueItem label="残高" value={total} />
      <Table highlightOnHover>
        <thead>{heads}</thead>
        <tbody>{rows}</tbody>
      </Table>
      <Button component={Link} to="create">
        収支入力
      </Button>
    </Stack>
  );
};

export default App;
