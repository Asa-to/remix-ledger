import { Payment } from "@prisma/client";
import { getUserTotalPay } from "./getUserTotalPay";

const getPayment: (payment?: Partial<Omit<Payment, "id">>) => Payment = (
  payment,
) => {
  return {
    id: "1",
    value: -100,
    category: "test",
    remarks: "Sample remarks",
    payDate: new Date("1999/01/01"),
    userId: "1",
    createdAt: new Date("1999/01/01"),
    updatedAt: new Date("1999/01/01"),
    payPer: 50,
    ...payment,
  };
};

describe("getUserTotalPay", () => {
  test("支出のみを合計する（収入は含めない）", () => {
    const payments = [
      getPayment({ value: -100, userId: "1" }),
      getPayment({ value: -200, userId: "1" }),
      getPayment({ value: 50, userId: "1" }),
    ];
    const totalPay = getUserTotalPay({ userId: "1", payments });
    expect(totalPay).toBe(300);
  });

  test("他のユーザーの支出は含めない", () => {
    const payments = [
      getPayment({ value: -100, userId: "1" }),
      getPayment({ value: -100, userId: "2" }),
    ];
    const totalPay = getUserTotalPay({ userId: "1", payments });
    expect(totalPay).toBe(100);
  });

  test("収入のみの場合は0", () => {
    const payments = [getPayment({ value: 100, userId: "1" })];
    const totalPay = getUserTotalPay({ userId: "1", payments });
    expect(totalPay).toBe(0);
  });
});
