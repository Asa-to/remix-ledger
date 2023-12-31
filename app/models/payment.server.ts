import type { Prisma, UserPayment } from "@prisma/client";
import { prisma } from "~/db.server";

export const createPayment = async (
  payment: Prisma.PaymentUncheckedCreateInput
) => {
  return prisma.payment.create({ data: payment });
};

export const getAllPayments = async () => {
  return prisma.payment.findMany({
    orderBy: [{ payDate: "desc" }],
  });
};

export const getPayment = async (id: string) => {
  return prisma.payment.findFirst({ where: { id } });
};

/**
 * startを含みendを含まない日付間のデータを返す
 * @param start
 * @param end
 * @returns
 */
export const getPaymentByDateRange = async (start: Date, end: Date) => {
  return prisma.payment.findMany({
    orderBy: [
      {
        payDate: "desc",
      },
    ],
    where: {
      payDate: {
        gte: start,
        lte: end,
      },
    },
  });
};

export const getCategories = async () => {
  return prisma.payment.findMany({
    select: {
      category: true,
    },
  });
};

export const getBalance = async () => {
  return prisma.payment.groupBy({
    by: ["value"],
    _sum: {
      value: true,
    },
  });
};

export const updatePayment = async (
  id: string,
  payment: Prisma.PaymentUncheckedCreateInput
) => {
  return prisma.payment.update({
    where: {
      id,
    },
    data: payment,
  });
};

export const deletePayment = async (id: string) => {
  return prisma.payment.delete({
    where: {
      id,
    },
  });
};

export const createUserPayment = async (
  userPayment: Prisma.UserPaymentUncheckedCreateInput
) => {
  return prisma.userPayment.create({
    data: userPayment,
  });
};

export const getUserCategories = async () => {
  return prisma.userPayment.findMany({
    select: {
      category: true,
    },
  });
};

/*
 * startを含みendを含まない日付間のデータを返す
 * @param start
 * @param end
 * @returns
 */
export const getUesrPaymentByDateRange = async (start: Date, end: Date) => {
  return prisma.userPayment.findMany({
    orderBy: [
      {
        payDate: "desc",
      },
    ],
    where: {
      payDate: {
        gte: start,
        lte: end,
      },
    },
  });
};

export const getUserPayment = async (id: string) => {
  return prisma.userPayment.findFirst({ where: { id } });
};

export const updateUserPayment = async (
  id: string,
  payment: Prisma.UserPaymentUncheckedUpdateInput
) => {
  return prisma.userPayment.update({
    where: {
      id,
    },
    data: payment,
  });
};

export const deleteUserPayment = async (id: string) => {
  return prisma.userPayment.delete({
    where: {
      id,
    },
  });
};
