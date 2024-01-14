import { Payment } from "@prisma/client";

type Props = {
  userId: string;
  payments: Payment[];
};

export const getUserTotalPay = (props: Props) => {
  const { userId, payments } = props;
  return Math.abs(
    payments
      .filter((v) => v.userId === userId)
      .reduce((pre, cur) => pre + cur.value, 0),
  );
};
