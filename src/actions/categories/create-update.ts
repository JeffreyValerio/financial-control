"use server";

import { Category } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";

const schema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string(),
  budget: z.coerce.number().transform((val) => Number(val.toFixed(2))),
  description: z.string(),
  type: z.enum(["INCOME", "EXPENSE"]),
});
export const CreateUpdateCategory = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    return {
      ok: false,
      message: `${parsed.error}`,
    };
  }

  const category = parsed.data;
  const { id, ...rest } = category;

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let category: Category;
      let message = "";

      if (id) {
        category = await prisma.category.update({
          where: { id },
          data: { ...rest },
        });
        message = `La categoría ${category.name} fue actualizada con éxito.`;
      } else {
        category = await prisma.category.create({
          data: { ...rest },
        });
        message = `La categoría ${category.name} fue creada con éxito.`;
      }

      return { category, message };
    });

    revalidatePath("/categories");
    revalidatePath(`/categories/${category.id}`);

    return {
      ok: true,
      category: prismaTx.category,
      message: prismaTx.message,
    };
  } catch (error) {
    return {
      ok: false,
      message: `No se pudo crear/actualizar la categoría.`,
    };
  }
};
