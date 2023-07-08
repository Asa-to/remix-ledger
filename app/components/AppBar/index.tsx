import { Drawer, useMantineTheme } from "@mantine/core";
import {
  AppShell,
  Burger,
  Button,
  Flex,
  Header,
  MediaQuery,
  Navbar,
  Stack,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Link } from "@remix-run/react";
import type { FC, ReactNode } from "react";
import { useState } from "react";

type Props = {
  children: ReactNode;
};
export const AppBar: FC<Props> = (props) => {
  const { children } = props;
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`, true);

  return (
    <AppShell
      padding="md"
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          width={{ sm: 200, lg: 300 }}
          hidden={!opened}
        >
          {isDesktop ? (
            <NavbarContent />
          ) : (
            <Drawer
              opened={opened}
              onClose={() => setOpened(false)}
              size={300}
              title="入出金管理"
              overlayProps={{ opacity: 0.5, blur: 4 }}
            >
              <NavbarContent />
            </Drawer>
          )}
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Flex justify="space-between" direction="row">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Title>入出金管理</Title>
            </Link>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger onClick={() => setOpened((v) => !v)} opened={opened} />
            </MediaQuery>
          </Flex>
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

const NavbarContent: FC = () => (
  <Stack spacing="8px">
    <Button component={Link} to="/">
      ホーム
    </Button>
    <Button component={Link} to="/user">
      ユーザー
    </Button>
  </Stack>
);
