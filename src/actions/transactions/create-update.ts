"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { Balance, Transaction } from "@prisma/client";
import { fromZonedTime } from "date-fns-tz";

const schema = z.object({
  id: z.string().uuid().optional().nullable(),
  description: z.string(),
  amount: z.coerce.number().transform((val) => Number(val.toFixed(2))),
  date: z.string().datetime(),
  type: z.enum(["INCOME", "EXPENSE"]),
  notes: z.string(),
  categoryId: z.string().uuid(),
});

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

export const CreateUpdateTransaction = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    return {
      ok: false,
      message: `${parsed.error}`,
    };
  }

  const transaction = parsed.data;
  const { id, date, ...rest } = transaction;

  const dateInUTC = fromZonedTime(date, "America/Costa_Rica");

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let transaction: Transaction;
      let message = "";
      let updatedBalance: Balance;

      if (id) {
        transaction = await prisma.transaction.update({
          where: { id },
          data: { ...rest, date: dateInUTC },
        });
        message = `El movimiento ${transaction.description} fue actualizado con éxito.`;
      } else {
        transaction = await prisma.transaction.create({
          data: { ...rest, date: dateInUTC },
        });
        message = `El movimiento ${transaction.description} fue creado con éxito.`;
      }

      let balance = await calculateBalance();
      const balanceFound = await prisma.balance.findFirst();

      if (balanceFound) {
        updatedBalance = await prisma.balance.update({
          where: {
            id: balanceFound?.id,
          },
          data: {
            balance,
          },
        });
      } else {
        updatedBalance = await prisma.balance.create({
          data: {
            balance,
          },
        });
      }

      return { transaction, message, updatedBalance };
    });

    revalidatePath("/transactions");
    revalidatePath(`/transactions/${transaction.id}`);

    return {
      ok: true,
      transaction: prismaTx.transaction,
      message: prismaTx.message,
      balance: prismaTx.updatedBalance,
    };
  } catch (error) {
    return {
      ok: false,
      message: `No se pudo crear/actualizar el movimiento.`,
    };
  }
};
