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
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { currencyFormat } from "@/lib/currency-format";
import { Edit } from "lucide-react";
import { format } from "date-fns";
import { GetTransactions } from "@/actions";

export const metadata = {
  title: "Movimientos",
  description: "Movimientos",
};

export default async function TransactionsPage() {
  const { transactions } = await GetTransactions();
  return (
    <Card className="h-fit w-full">
      <CardHeader className="grid grid-cols-2 items-center">
        <div className="">
          <CardTitle>Movimientos</CardTitle>
          <CardDescription>Listado de movimientos</CardDescription>
        </div>
        <div className="flex justify-end">
          <Link href={"/transactions/new"} className="font-bold">
            Nueva
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Listado de movimientos</TableCaption>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead className="sr-only">Date</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="sr-only">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="w-full">
                <TableCell>
                  {format(new Date(transaction.date), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="font-medium uppercase">
                  {transaction.description}
                </TableCell>
                <TableCell>{currencyFormat(transaction.amount)}</TableCell>
                <TableCell className="font-medium">
                  {transaction.notes}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.type === "EXPENSE" ? "destructive" : "success"
                    }
                  >
                    <Link href={`categories/${transaction.category.id}`}>
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
