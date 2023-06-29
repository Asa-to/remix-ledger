import type { Payment } from "@prisma/client";
import { prisma } from "~/db.server";

type Omited = "id" | "updatedAt" | "payDate" | "createdAt";
export const createPayment = async (payment: Omit<Payment, Omited>) => {
  return prisma.payment.create({ data: payment });
};

export const getAllPayments = async () => {
  return prisma.payment.findMany();
};

export const getPayment = async (id: string) => {
  return prisma.payment.findFirst({ where: { id } });
};

export const getCategories = async (id: string) => {
  return prisma.payment.findMany({
    where: {
      id,
    },
    select: {
      category: true,
    },
  });
};
