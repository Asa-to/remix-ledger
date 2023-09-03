import { redirect } from "remix-typedjson";

export const loader = async () => {
  return redirect("/payment");
};
