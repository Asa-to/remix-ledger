import { AppShell, Button, Header, Navbar, Stack, Title } from "@mantine/core";
import { Link } from "@remix-run/react";
import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const AppBar: FC<Props> = (props) => {
  const { children } = props;

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} height="100%" p="xs">
          <Stack spacing="8px">
            <Link
              to="home"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button>ホーム</Button>
            </Link>
            <Link
              to="user"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button>ユーザー</Button>
            </Link>
          </Stack>
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Title>入出金管理</Title>
          </Link>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
};
