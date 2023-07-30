import { Button, Stack } from "@mantine/core";
import { Link } from "@remix-run/react";
import type { FC } from "react";

const App: FC = () => {
  return (
    <Stack>
      <Button component={Link} to="/payment">
        入出金へ
      </Button>
      <Button component={Link} to="/user">
        ユーザー管理へ
      </Button>
    </Stack>
  );
};

export default App;
