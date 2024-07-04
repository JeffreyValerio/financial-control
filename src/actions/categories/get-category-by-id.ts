"use server";

import prisma from "@/lib/prisma";
interface Props {
  id: string;
}
export const GetCategoryById = async ({ id }: Props) => {
  try {
    const category = await prisma.category.findFirst({
      where: { id },
      include: {
        Transaction: true,
      },
    });

    if (!category) return null;

    const totalCategories = prisma.category.count();
    const transactions = category.Transaction.map((transaction) => ({
      ...transaction,
    }));

    return {
      ...category,
      transactions,
      totalCategories,
    };
  } catch (error) {
    throw new Error(`Error al obtener la categoría: ${error}`);
  }
};
