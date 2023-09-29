import { createCookie } from "@remix-run/node";

export const userIdCookie = createCookie("userId");

export const isLoginCookie = createCookie("isLogin");
