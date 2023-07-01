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
            <Button>
              <Link
                to="home"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                ホーム
              </Link>
            </Button>
            <Button>
              <Link
                to="user"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                ユーザー
              </Link>
            </Button>
          </Stack>
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Title>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              入出金管理
            </Link>
          </Title>
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
