import { Payment, User } from "@prisma/client";
import { getUserTotalPay } from "./getUserTotalPay";

const user: User = {
  id: "1",
  name: "test",
  createdAt: new Date("1999/01/01"),
  updatedAt: new Date("1999/01/01"),
  icon: null,
};
const payments: Payment[] = [
  {
    id: "1",
    value: 100,
    category: "test",
    remarks: "Sample remarks",
    payDate: new Date("1999/01/01"),
    userId: "1",
    createdAt: new Date("1999/01/01"),
    updatedAt: new Date("1999/01/01"),
    payPer: 50,
  },
  {
    id: "2",
    value: 100,
    category: "test",
    remarks: "Sample remarks",
    payDate: new Date("1999/01/01"),
    userId: "1",
    createdAt: new Date("1999/01/01"),
    updatedAt: new Date("1999/01/01"),
    payPer: 50,
  },
  {
    id: "3",
    value: -100,
    category: "test",
    remarks: "Sample remarks",
    payDate: new Date("1999/01/01"),
    userId: "1",
    createdAt: new Date("1999/01/01"),
    updatedAt: new Date("1999/01/01"),
    payPer: 50,
  },
  {
    id: "4",
    value: 100,
    category: "test",
    remarks: "Sample remarks",
    payDate: new Date("1999/01/01"),
    userId: "2",
    createdAt: new Date("1999/01/01"),
    updatedAt: new Date("1999/01/01"),
    payPer: 50,
  },
];

describe("getUserTotalPay", () => {
  test("普通に動くことの確認", () => {
    const totalPay = getUserTotalPay({ userId: "1", payments });
    expect(totalPay).toBe(100);
  });
});
