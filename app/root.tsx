import { MantineProvider } from "@mantine/core";
import { cssBundleHref } from "@remix-run/css-bundle";
import { redirect, type ActionArgs, type LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import sha256 from "crypto-js/sha256";
import styles from "~/styles/global.css";
import { isLoginCookie } from "./cookie.server";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "manifest",
    href: "/manifest.json",
  },
];

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  const hash =
    "71f7bf21c708ba1233596264ce0224c24104b016bd9844df953f68a2a422acb7";
  const canLogin =
    hash === sha256(body.get("password")?.toString() ?? "")?.toString();
  if (canLogin) {
    return redirect("/", {
      headers: {
        "Set-Cookie": await isLoginCookie.serialize({
          isLogin: canLogin,
        }),
      },
    });
  }
};

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body style={{ padding: 0 }}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </MantineProvider>
      </body>
    </html>
  );
}
