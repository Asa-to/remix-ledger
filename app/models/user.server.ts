import { prisma } from "~/db.server";

export const createUser = async (name: string, icon?: string) => {
  return prisma.user.create({ data: { name, icon } });
};

export const getAllUsers = async () => {
  return prisma.user.findMany();
};

export const getUser = async (id: string) => {
  return prisma.user.findFirst({ where: { id } });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({ where: { id } });
};
