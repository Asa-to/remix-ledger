import { Box } from "@mantine/core";
import { Outlet } from "@remix-run/react";
import { AppBar } from "~/components/AppBar";

const AppLayout = () => {
  return (
    <Box sx={{ backgroundColor: "#c8c8c8" }}>
      <AppBar>
        <Outlet />
      </AppBar>
    </Box>
  );
};

export default AppLayout;
