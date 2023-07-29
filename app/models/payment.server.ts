import type { Prisma } from "@prisma/client";
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
