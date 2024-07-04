"use server";

import prisma from "@/lib/prisma";

export const GetBalance = async () => {
  try {
    const balance = await prisma.balance.findFirst();

    return {
      balance: balance?.balance,
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
};