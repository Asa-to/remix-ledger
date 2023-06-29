import { prisma } from "~/db.server";

export const createUser = async (name: string, icon?: string) => {
  return prisma.user.create({ data: { name, icon } });
};

export const getAllUsers = async () => {
  return prisma.user.findMany();
};
