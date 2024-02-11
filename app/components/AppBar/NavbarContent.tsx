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
        グループの家計簿へ
      </Button>
      <Button component={Link} to={`/user/${userId}`} onClick={closeNavBar}>
        個人の家計簿へ
      </Button>
      <Button component={Link} to="/toBuy" onClick={closeNavBar}>
        グループの買う物リスト
      </Button>
    </Stack>
  );
};
