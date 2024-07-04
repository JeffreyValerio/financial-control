import Link from "next/link";

import { cn } from "@/lib/utils";
import { currencyFormat } from "@/lib/currency-format";
import { Edit } from "lucide-react";
import { ICategory } from "@/interfaces";
import { TableCell, TableRow } from "../ui/table";

interface Props {
  category: ICategory;
}
export const CategoryTable = ({ category }: Props) => {
  const sumTransactions = (transactions: any[]) => {
    return transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
  };

  return (
    <TableRow className="w-full">
      <TableCell className="font-medium">{category.name}</TableCell>
      <TableCell>{category.description}</TableCell>
      <TableCell>{currencyFormat(category.budget)}</TableCell>
      <TableCell>
        {currencyFormat(sumTransactions(category.Transaction))}
      </TableCell>
      <TableCell
        className={cn("font-medium", {
          "text-red-500":
            category.budget - sumTransactions(category.Transaction) <= 0,
          "text-green-500":
            category.budget - sumTransactions(category.Transaction) > 0 ||
            category.budget == sumTransactions(category.Transaction),
          "text-blue-600": sumTransactions(category.Transaction) == 0,
        })}
      >
        {currencyFormat(
          category.budget - sumTransactions(category.Transaction)
        )}
      </TableCell>
      <TableCell className="text-right flex justify-end">
        <Link href={`/categories/${category.id}`}>
          <Edit size={18} strokeWidth={1} />
        </Link>
      </TableCell>
    </TableRow>
  );
};
