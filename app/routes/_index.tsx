import { Blockquote } from "@mantine/core";
import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return <Blockquote cite="そくそく">力こそパワー</Blockquote>;
}
