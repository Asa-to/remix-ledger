import { Title } from "@mantine/core";
import type { LoaderArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { getUser } from "~/models/user.server";

export const loader = async ({ params }: LoaderArgs) => {
  const user = await getUser(params.userId ?? "");
  return typedjson({
    user,
  });
};

const AppLayout = () => {
  const { user } = useTypedLoaderData<typeof loader>();

  return <Title>{user?.name}</Title>;
};

export default AppLayout;
