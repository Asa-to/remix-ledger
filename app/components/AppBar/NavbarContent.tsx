import { Button, Stack } from "@mantine/core";
import { Link } from "@remix-run/react";
import type { FC } from "react";

type Props = {
  closeNavBar: () => void;
  userId: string;
};

export const NavbarContent: FC<Props> = (props) => {
  const { closeNavBar, userId } = props;
  return (
    <Stack spacing="8px" mt="60px">
      <Button component={Link} to="/payment" onClick={closeNavBar}>
        入出金
      </Button>
      <Button component={Link} to={`/user/${userId}`} onClick={closeNavBar}>
        マイページ
      </Button>
      <Button component={Link} to="/toBuy" onClick={closeNavBar}>
        買う物リスト
      </Button>
    </Stack>
  );
};
