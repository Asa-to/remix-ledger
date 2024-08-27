import { Box, Button, Drawer } from "@mantine/core";
import { Burger, Header } from "@mantine/core";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import { NavbarContent } from "./NavbarContent";
import { HeaderContent } from "./Header";
import { Link, useLocation } from "@remix-run/react";

type Props = {
  children: ReactNode;
  userId: string;
};

export const AppBar: FC<Props> = (props) => {
  const { children, userId } = props;
  const [opened, setOpened] = useState(false);

  return (
    <Box mih="100vh">
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        size={300}
        overlayProps={{ opacity: 0.5, blur: 4 }}
      >
        <NavbarContent closeNavBar={() => setOpened(false)} userId={userId} />
      </Drawer>
      <Header
        height="60px"
        maw="765px"
        mx="auto"
        sx={{
          position: "fixed",
          boxSizing: "border-box",
          border: "none",
          backgroundColor: "white",
        }}
      >
        <HeaderContent title="入出金管理">
          <Button component={Link} to="/logout">
            ログアウト
          </Button>
          <Burger onClick={() => setOpened((v) => !v)} opened={opened} />
        </HeaderContent>
      </Header>
      <Box
        pt="60px"
        maw="765px"
        mx="auto"
        p="4px"
        mih="100vh"
        sx={{
          backgroundColor: "rgb(248,249,250)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
