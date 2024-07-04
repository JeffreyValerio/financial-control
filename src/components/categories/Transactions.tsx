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
import { format } from "date-fns";
import { Edit } from "lucide-react";
import Link from "next/link";

interface Props {
  transactions: ITransaction[];
}
export const TransactionList = ({ transactions }: Props) => {
  return (
    <Table>
      <TableCaption>Listado de movimientos</TableCaption>
      <TableHeader>
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
        {transactions.map((transaction) => (
          <TableRow key={transaction.id} className="w-full">
            <TableCell>
              {format(new Date(transaction.date), "dd/MM/yyyy")}{" "}
            </TableCell>
            <TableCell className="font-medium">
              {transaction.description}
            </TableCell>
            <TableCell>{currencyFormat(transaction.amount)}</TableCell>
            <TableCell className="font-medium">
              {transaction.type === "INCOME" ? "Ingreso" : "Gasto"}
            </TableCell>
            <TableCell className="font-medium">{transaction.notes}</TableCell>

            <TableCell className="text-right flex justify-end">
              <Link href={`/transactions/${transaction.id}`}>
                <Edit size={18} strokeWidth={1} />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
