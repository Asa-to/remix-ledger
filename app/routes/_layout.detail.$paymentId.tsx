import type { LoaderArgs } from "@remix-run/node";
import type { FC } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { getPayment } from "~/models/payment.server";

export const loader = async ({ params }: LoaderArgs) => {
  const payment = await getPayment(params.paymentId as string);
  return typedjson({ payment });
};

const DetailPage: FC = () => {
  const { payment } = useTypedLoaderData<typeof loader>();

  if (!payment) {
    return <>no data</>;
  }

  return (
    <ul>
      <li>{payment.id}</li>
      <li>{payment.value}</li>
    </ul>
  );
};

export default DetailPage;
