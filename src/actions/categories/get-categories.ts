"use server";

import prisma from "@/lib/prisma";

export const GetCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        Transaction: {
          orderBy: {
            date: "desc",
          },
        },
      },
    });
    const totalCategories = await prisma.category.count();
    const incomes = await prisma.category.aggregate({
      _sum: {
        budget: true,
      },
      where: {
        type: "INCOME",
      },
    });
    const expenses = await prisma.category.aggregate({
      _sum: {
        budget: true,
      },
      where: {
        type: "EXPENSE",
      },
    });

    return {
      categories,
      totalCategories,
      totalExpenses: expenses._sum.budget,
      totalIncomes: incomes._sum.budget,
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
};
