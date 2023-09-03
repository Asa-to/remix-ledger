import { Button, Drawer, useMantineTheme } from "@mantine/core";
import { AppShell, Burger, Header, MediaQuery, Navbar } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import { NavbarContent } from "./NavbarContent";
import { HeaderContent } from "./Header";
import { Link, useLocation } from "@remix-run/react";

type Props = {
  children: ReactNode;
};

export const AppBar: FC<Props> = (props) => {
  const { children } = props;
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`, true);
  const location = useLocation();
  const pathname = location.pathname;
  const search = location.search;

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
            <NavbarContent onClick={() => setOpened(false)} />
          ) : (
            <Drawer
              opened={opened}
              onClose={() => setOpened(false)}
              size={300}
              title="入出金管理"
              overlayProps={{ opacity: 0.5, blur: 4 }}
            >
              <NavbarContent onClick={() => setOpened(false)} />
            </Drawer>
          )}
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <HeaderContent title="入出金管理">
            <Button
              component={Link}
              to="/payment/create"
              state={{ from: pathname + search }}
              variant="gradient"
            >
              収支入力
            </Button>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger onClick={() => setOpened((v) => !v)} opened={opened} />
            </MediaQuery>
          </HeaderContent>
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
