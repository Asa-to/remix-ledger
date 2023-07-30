import { Button, Flex, Text, Stack, Box } from "@mantine/core";
import type { Payment, User } from "@prisma/client";
import { Link } from "@remix-run/react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

type Props = {
  payment: Payment;
  users: User[];
};

export const PaymentCard = (props: Props) => {
  const { payment, users } = props;
  const isIncome = 0 <= payment.value;

  return (
    <Stack spacing={0}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        <Flex direction="column" align="start">
          <Button
            variant="subtle"
            component={Link}
            to={`edit/${payment.id}`}
            p={0}
            sx={{ height: "fit-content" }}
          >
            <Flex direction="row" align="center" gap="4px">
              <AiOutlineEdit />
              <Text sx={{ whiteSpace: "nowrap" }}>編集</Text>
            </Flex>
          </Button>
          <Button
            p={0}
            component={Link}
            to={`delete/${payment.id}`}
            variant="subtle"
            sx={{ height: "fit-content" }}
          >
            <Flex direction="row" align="center" gap="4px">
              <AiOutlineDelete />
              <Text sx={{ whiteSpace: "nowrap" }}>削除</Text>
            </Flex>
          </Button>
        </Flex>
        <Text align="left" my="auto">
          {users.filter((user) => user.id === payment.userId)[0].name}{" "}
        </Text>
        <Text align="left" my="auto">
          {payment.category}
        </Text>
        <Text color={isIncome ? "blue" : "red"} my="auto" align="end">
          {payment.value}
        </Text>
      </Box>
    </Stack>
  );
};