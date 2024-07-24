"use server";

import prisma from "@/lib/prisma";
import { endOfMonth, startOfMonth } from "date-fns";

export const GetCategories = async () => {
  try {
    const now = new Date();
    const startDate = startOfMonth(now);
    const endDate = endOfMonth(now);

    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        Transaction: {
          orderBy: {
            date: "desc",
          },
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
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
