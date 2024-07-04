"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

interface Props {
  id: string;
}

const calculateBalance = async () => {
  const transactions = await prisma.transaction.findMany();
  let balance = 0.0;

  transactions.forEach((transaction) => {
    if (transaction.type === "INCOME") {
      balance += transaction.amount;
    } else if (transaction.type === "EXPENSE") {
      balance -= transaction.amount;
    }
  });
  return balance;
};

export const DeleteTransaction = async ({ id }: Props) => {
  try {
    const transactionFound = await prisma.transaction.findUnique({
      where: { id },
    });

    if (transactionFound) {
      await prisma.transaction.delete({
        where: { id },
      });
    }

    let balance = await calculateBalance();
    const balanceFound = await prisma.balance.findFirst();

    if (balanceFound) {
      await prisma.balance.update({
        where: {
          id: balanceFound?.id,
        },
        data: {
          balance,
        },
      });
    }

    revalidatePath("/categories");

    return {
      ok: true,
      message: `El movimiento fue eliminado con éxito`,
    };
  } catch (error) {
    return {
      ok: false,
      message: `No se puede eliminar el movimiento: ${error}`,
    };
  }
};
