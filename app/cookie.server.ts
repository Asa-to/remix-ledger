import { createCookie } from "@remix-run/node";

export const userCookie = createCookie("user", {
  maxAge: 2147483647,
});
