import { Flex } from "@mantine/core";
import type { LoaderArgs } from "@remix-run/node";
import type { FC } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { LabelValueItem } from "~/components/LabelValueItem";
import { getPayment } from "~/models/payment.server";
import { getUser } from "~/models/user.server";
import { formatDateTime } from "~/utils/date/formatDateTime";

export const loader = async ({ params }: LoaderArgs) => {
  const payment = await getPayment(params.paymentId as string);
  const user = await getUser(payment?.userId as string);
  return typedjson({ payment, user });
};

const DetailPage: FC = () => {
  const { payment, user } = useTypedLoaderData<typeof loader>();

  if (!payment || !user) {
    return <>no data</>;
  }

  return (
    <Flex direction="column">
      <LabelValueItem
        label="日付"
        value={formatDateTime(payment.payDate, "YYYY年MM月DD日")}
      />
      <LabelValueItem label="ユーザー" value={user.name} />
      <LabelValueItem label="カテゴリー" value={payment.category} />
      <LabelValueItem label="金額" value={payment.value.toString()} />
    </Flex>
  );
};

export default DetailPage;
