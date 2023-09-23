import { Box, Button, Drawer } from "@mantine/core";
import { Burger, Header } from "@mantine/core";
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
  const location = useLocation();
  const pathname = location.pathname;
  const search = location.search;

  return (
    <Box>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        size={300}
        title="入出金管理"
        overlayProps={{ opacity: 0.5, blur: 4 }}
      >
        <NavbarContent onClick={() => setOpened(false)} />
      </Drawer>
      <Header
        height="60px"
        sx={{ position: "fixed", boxSizing: "border-box", border: "none" }}
      >
        <HeaderContent title="入出金管理">
          <Button
            component={Link}
            to="/payment/create"
            state={{ from: pathname + search }}
            variant="gradient"
          >
            収支入力
          </Button>
          <Burger onClick={() => setOpened((v) => !v)} opened={opened} />
        </HeaderContent>
      </Header>
      <Box
        mt="60px"
        maw="765px"
        mx="auto"
        p="4px"
        sx={{
          backgroundColor: "rgb(248,249,250)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
