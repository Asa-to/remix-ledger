import { Outlet } from "@remix-run/react";
import { AppBar } from "~/components/AppBar";

const AppLayout = () => {
  return (
    <AppBar>
      <Outlet />
    </AppBar>
  );
};

export default AppLayout;
