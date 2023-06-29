import { Card, CardSection } from "@mantine/core";
import type { Payment } from "@prisma/client";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPayment } from "~/models/payment.server";

export const loader: LoaderFunction = async ({ params }: ActionArgs) => {
  const res = await getPayment(params.id as string);
  if (!res) {
    throw redirect("/home");
  }
  return json({ title: "new" });
};

const PaymentView = () => {
  const payment = useLoaderData<Payment>();
  return (
    <Card>
      <CardSection>{payment.category}</CardSection>
    </Card>
  );
};

export default PaymentView;
