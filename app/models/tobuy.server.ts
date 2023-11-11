import type { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

export const createToBuy = async (toBuy: Prisma.ToBuyUncheckedCreateInput) => {
  return prisma.toBuy.create({ data: toBuy });
};

export const getAllToBuy = async () => {
  return prisma.toBuy.findMany();
};

export const deleteToBuy = async (id: string) => {
  return prisma.toBuy.delete({ where: { id } });
};

export const deleteToBuys = async (ids: string[]) => {
  return prisma.toBuy.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};
