import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { currencyFormat } from "@/lib/currency-format";
import { Edit, PlusCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { GetTransactions } from "@/actions";
import React from "react";
import { ITransaction } from "@/interfaces";

export const metadata = {
  title: "Movimientos",
  description: "Movimientos",
};

interface IGroupedTransactions {
  [key: string]: ITransaction[];
}

const groupTransactionsByMonth = (
  transactions: ITransaction[]
): IGroupedTransactions => {
  return transactions.reduce((acc, transaction) => {
    const date: any =
      typeof transaction.date === "string"
        ? parseISO(transaction.date)
        : transaction.date;
    const monthYear = format(date, "MMMM yyyy");

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }

    acc[monthYear].push(transaction);
    return acc;
  }, {} as IGroupedTransactions);
};

export default async function TransactionsPage() {
  const { transactions } = await GetTransactions();
  const groupedTransactions = groupTransactionsByMonth(transactions);

  if (!transactions) return <></>;
  
  return (
    <Card>
      <CardHeader className="grid grid-cols-2 items-center">
        <div>
          <CardTitle>Movimientos</CardTitle>
          <CardDescription>Listado de movimientos</CardDescription>
        </div>
        <div className="flex justify-end">
          <Link
            href={"/transactions/new"}
            className="font-medium text-sm rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2"
          >
            <PlusCircle size={18} />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Listado de movimientos</TableCaption>
          {Object.keys(groupedTransactions).map((monthYear) => (
            <ScrollArea className="h-[500px] w-full rounded-md" key={monthYear}>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={6} className="text-lg font-bold">
                    {monthYear}
                  </TableHead>
                </TableRow>
                <TableRow className="text-xs">
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Notas</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="sr-only">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedTransactions[monthYear].map(
                  (transaction: ITransaction) => (
                    <TableRow key={transaction.id} className="w-full">
                      <TableCell>
                        {transaction.date?.toLocaleDateString("es-CR")}
                      </TableCell>
                      <TableCell className="font-medium uppercase">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        {currencyFormat(transaction.amount)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.notes}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === "EXPENSE"
                              ? "destructive"
                              : "success"
                          }
                        >
                          <Link href={`categories/${transaction?.category.id}`}>
                            {transaction.category.name}
                          </Link>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right flex justify-end">
                        <Link href={`/transactions/${transaction.id}`}>
                          <Edit size={18} strokeWidth={1} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </ScrollArea>
          ))}
        </Table>
      </CardContent>
    </Card>
  );
}
