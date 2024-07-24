import { GetCategories } from "@/actions";
import { TableForm } from "@/components";
import { CategoryTable } from "@/components/categories/Table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ICategory } from "@/interfaces";
import { currencyFormat } from "@/lib/currency-format";
import React from "react";

export const metadata = {
  title: "Categorías",
  description: "Categorías",
};

export default async function CategoriesPage() {
  const { categories, totalExpenses, totalIncomes } = await GetCategories();

  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <CardTitle>Categorías</CardTitle>
        <CardDescription>Listado de categorías</CardDescription>
      </CardHeader>

      <CardContent className="flex items-center justify-center">
        <TableForm />
      </CardContent>

      <CardContent className="grid md:grid-cols-2 gap-8">
        <Table>
          <TableCaption>
            <div className="flex items-center justify-between font-bold">
              <p>Total Egresos</p>
              <p> {currencyFormat(Number(totalExpenses))}</p>
            </div>
          </TableCaption>
          <ScrollArea className="h-[500px] w-full rounded-md">
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Presupuesto</TableHead>
                <TableHead>Utilizado</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead className="sr-only">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category: ICategory) => (
                <React.Fragment key={category.id}>
                  {category.type === "EXPENSE" && (
                    <CategoryTable category={category} />
                  )}
                </React.Fragment>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total Egresos</TableCell>
                <TableCell colSpan={2} className="font-bold">
                  {currencyFormat(Number(totalExpenses))}
                </TableCell>
              </TableRow>
            </TableFooter>
          </ScrollArea>
        </Table>

        <Table>
          <TableCaption>
            <div className="flex items-center justify-between font-bold">
              <p>Total Ingresos</p>
              <p>{currencyFormat(Number(totalIncomes))}</p>
            </div>
          </TableCaption>
          <ScrollArea className="w-full rounded-md">
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Presupuesto</TableHead>
                <TableHead>Utilizado</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead className="sr-only">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <React.Fragment key={category.id}>
                  {category.type === "INCOME" && (
                    <CategoryTable category={category} />
                  )}
                </React.Fragment>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total Ingresos</TableCell>
                <TableCell colSpan={2} className="font-bold">
                  {currencyFormat(Number(totalIncomes))}
                </TableCell>
              </TableRow>
            </TableFooter>
          </ScrollArea>
        </Table>
      </CardContent>
    </Card>
  );
}
