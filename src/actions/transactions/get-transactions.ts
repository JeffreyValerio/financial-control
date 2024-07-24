"use server";

import prisma from "@/lib/prisma";

export const GetTransactions = async () => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: { 
        category: true,
      },
    });
    const totalTransactions = await prisma.transaction.count();
    return {
      transactions,
      totalTransactions,
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
};