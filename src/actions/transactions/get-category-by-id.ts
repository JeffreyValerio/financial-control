"use server";

import prisma from "@/lib/prisma";
interface Props {
  id: string;
}
export const GetTransactionById = async ({ id }: Props) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id },
    });

    if (!transaction) return null;

    const totalTransactions = prisma.transaction.count();

    return {
      ...transaction,
      totalTransactions,
    };
  } catch (error) {
    throw new Error(`Error al obtener el movimiento: ${error}`);
  }
};
