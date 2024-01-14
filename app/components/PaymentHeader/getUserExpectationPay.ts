import { Payment } from "@prisma/client";

type Props = {
  userId: string;
  payments: Payment[];
};

export const getUserExpectationPay = (props: Props) => {
  const { userId, payments } = props;
  return Math.abs(
    payments.reduce((pre, cur) => {
      const isMyPay = cur.userId === userId;
      const isPay = cur.value < 0;
      if (!isPay) {
        return pre;
      }

      switch (isMyPay) {
        case true:
          return pre + (cur.value * cur.payPer) / 100;
        case false:
          return pre + (cur.value * (100 - cur.payPer)) / 100;
      }
    }, 0),
  );
};
