import { LoaderArgs } from "@remix-run/node";
import { redirect } from "remix-typedjson";
import { userCookie } from "~/cookie.server";

export const loader = async ({ request }: LoaderArgs) => {
  return redirect("/", {
    headers: {
      "Set-Cookie": await userCookie.serialize({}),
    },
  });
};
