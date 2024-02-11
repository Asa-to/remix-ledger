import { Payment } from "@prisma/client";

type Props = {
  userId: string;
  payments: Payment[];
};

// 支払った総額
export const getUserTotalPay = (props: Props) => {
  const { userId, payments } = props;
  return payments
    .filter((v) => v.userId === userId)
    .reduce((pre, cur) => pre + Math.abs(cur.value), 0);
};
