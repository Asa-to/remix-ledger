import { AppShell, Button, Header, Navbar, Stack, Title } from "@mantine/core";
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
            <Button component="a" href="/home">
              ホーム
            </Button>
            <Button component="a" href="/user">
              ユーザー
            </Button>
          </Stack>
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Title>入出金管理</Title>
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
