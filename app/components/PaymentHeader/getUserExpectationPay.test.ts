import { Payment, User } from "@prisma/client";
import { getUserExpectationPay } from "./getUserExpectationPay";

const user: User = {
  id: "1",
  name: "test",
  createdAt: new Date("1999/01/01"),
  updatedAt: new Date("1999/01/01"),
  icon: null,
};

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

describe("getUserExpectationPay", () => {
  test("負担割合100%を考慮できる", () => {
    const totalPay = getUserExpectationPay({
      userId: "1",
      payments: [getPayment({ payPer: 100 })],
    });
    expect(totalPay).toBe(100);
  });

  test("別のユーザーの負担割合100%を考慮できる", () => {
    const totalPay = getUserExpectationPay({
      userId: "1",
      payments: [getPayment({ payPer: 100, userId: "2" })],
    });
    expect(totalPay).toBe(0);
  });

  test("別のユーザーの支出を考慮できる", () => {
    const totalPay = getUserExpectationPay({
      userId: "1",
      payments: [getPayment({ userId: "2" })],
    });
    expect(totalPay).toBe(50);
  });

  test("別のユーザーの収入を考慮しない", () => {
    const totalPay = getUserExpectationPay({
      userId: "1",
      payments: [getPayment(), getPayment({ userId: "2", value: 50 })],
    });
    expect(totalPay).toBe(50);
  });
});
