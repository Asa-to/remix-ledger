import { Button, Stack } from "@mantine/core";
import { Link } from "@remix-run/react";
import type { FC } from "react";

type Props = {
  onClick?: () => void;
};

export const NavbarContent: FC<Props> = (props) => {
  const { onClick } = props;
  return (
    <Stack spacing="8px">
      <Button component={Link} to="/" onClick={onClick}>
        ホーム
      </Button>
      <Button component={Link} to="/user" onClick={onClick}>
        ユーザー
      </Button>
    </Stack>
  );
};
