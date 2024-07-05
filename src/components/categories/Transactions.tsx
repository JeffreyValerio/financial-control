import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITransaction } from "@/interfaces";
import { currencyFormat } from "@/lib/currency-format";
import { format, parseISO, isValid } from "date-fns";
import { Edit } from "lucide-react";
import React from "react";

interface Props {
  transactions: ITransaction[];
}

interface IGroupedTransactions {
  [key: string]: ITransaction[];
}

const groupTransactionsByMonth = (
  transactions: ITransaction[]
): IGroupedTransactions => {
  return transactions.reduce((acc, transaction) => {
    // Asegurarse de que transaction.date es un objeto Date
    const date =
      typeof transaction.date === "string"
        ? parseISO(transaction.date)
        : transaction.date;

    // Verificar si la fecha es válida
    if (!isValid(date)) {
      console.error(
        `Fecha inválida para la transacción con ID ${transaction.id}: ${transaction.date}`
      );
      return acc;
    }

    const monthYear = format(date, "MMMM yyyy");

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }

    acc[monthYear].push(transaction);
    return acc;
  }, {} as IGroupedTransactions);
};

export const TransactionList = ({ transactions }: Props) => {
  const groupedTransactions = groupTransactionsByMonth(transactions);

  return (
    <Table>
      <TableCaption>Listado de movimientos</TableCaption>
      {Object.keys(groupedTransactions).map((monthYear) => (
        <React.Fragment key={monthYear}>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={6} className="text-lg font-bold">
                {monthYear}
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="sr-only">Date</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead className="sr-only">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedTransactions[monthYear].map((transaction) => (
              <TableRow key={transaction.id} className="w-full">
                <TableCell>{format(transaction.date, "dd/MM/yyyy")} </TableCell>
                <TableCell className="font-medium">
                  {transaction.description}
                </TableCell>
                <TableCell>{currencyFormat(transaction.amount)}</TableCell>
                <TableCell className="font-medium">
                  {transaction.type === "INCOME" ? "Ingreso" : "Gasto"}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.notes}
                </TableCell>
                <TableCell className="text-right flex justify-end">
                  <Link href={`/transactions/${transaction.id}`}>
                    <Edit size={18} strokeWidth={1} />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </React.Fragment>
      ))}
    </Table>
  );
};
