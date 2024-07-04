"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { CreateUpdateCategory } from "@/actions";
import { currencyFormat } from "@/lib/currency-format";
import { ICategory, ITransaction } from "@/interfaces";
import { Input } from "../ui/input";
import { LoaderIcon } from "lucide-react";
import { TableSkeleton } from "./TableSkeleton";
import { Textarea } from "../ui/textarea";
import { TransactionList } from "./Transactions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  category: Partial<ICategory>;
  title: string;
}

interface FormInputs {
  name: string;
  budget: number;
  description: string;
  type: string;
}

export const CategoryForm = ({ category, title }: Props) => {
  const router = useRouter();
  const [formModified, setFormModified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  const { handleSubmit, register, control } = useForm<FormInputs>({
    defaultValues: {
      ...category,
    },
  });

  const getTransactions = async () => {
    setLoading(true);

    try {
      let transactions: ITransaction[] = [];
      category.Transaction?.forEach((transaction: ITransaction) => {
        if (transaction.type === category.type) transactions.push(transaction);
      });
      setTransactions(transactions);
      console.log({ transactions });
    } catch (error) {
      console.error("Error loading transactions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactions();
  }, [category]);

  const handleInputChange = () => {
    setFormModified(true);
  };
  const onSubmit = async (data: FormInputs) => {
    setLoading(true);

    try {
      const formData = new FormData();

      const { ...categoryToSave } = data;

      if (category.id) formData.append("id", category.id);
      formData.append("name", categoryToSave.name);
      formData.append("budget", `${categoryToSave.budget}`);
      formData.append("description", categoryToSave.description);
      formData.append("type", categoryToSave.type);

      const {
        ok,
        message,
        category: updatedCategory,
      } = await CreateUpdateCategory(formData);

      if (ok) {
        console.log("READY");
        console.log({ message });
        router.replace(`/categories/${updatedCategory?.id}`);
        // router.replace(`/categories`);
      } else {
        console.log("ERROR");
        console.log({ message });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sumTransactions = (transactions: any[]) => {
    return transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{category.name ?? ""}</CardTitle>
        {category.Transaction && (
          <CardDescription>
            Utilizado: {currencyFormat(sumTransactions(category.Transaction))}{" "}
            <br />
            Balance:{" "}
            {currencyFormat(
              Number(category.budget) - sumTransactions(category.Transaction)
            )}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="grid sm:grid-cols-3 gap-4 justify-between relative">
        <div className="sm:col-start-1 sm:col-end-2">
          <div className="sticky top-10">
            <form
              onSubmit={handleSubmit(onSubmit)}
              onChange={handleInputChange}
            >
              <fieldset>
                <legend>{title}</legend>

                <section>
                  <div className="flex flex-col">
                    <label htmlFor="name">Nombre</label>
                    <Input
                      {...register("name", {
                        required: "El nombre de la categoría es requerido",
                      })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="budget">Presupuesto</label>
                    <Input
                      type="number"
                      step={0.01}
                      {...register("budget", { required: true })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="description">Descripción</label>
                    <Textarea
                      {...register("description", {
                        required: "La descripción es un campo requerido",
                      })}
                    />
                  </div>
                  <div className="flex flex-col !text-black">
                    <label htmlFor="type">Tipo</label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="INCOME">INGRESO</SelectItem>
                              <SelectItem value="EXPENSE">GASTO</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </section>

                <div className="flex justify-between items-center gap-2 pt-8">
                  <Button
                    className="w-full"
                    disabled={!formModified || loading}
                  >
                    {loading ? (
                      <LoaderIcon strokeWidth={1} className={"animate-spin"} />
                    ) : (
                      <p>{title}</p>
                    )}
                  </Button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>

        {loading ? (
          <div className="sm:col-start-2 sm:col-end-4">
            <TableSkeleton />
          </div>
        ) : (
          <div className="sm:col-start-2 sm:col-end-4">
            <TransactionList transactions={transactions} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => router.back()}>Regresar</Button>
      </CardFooter>
    </Card>
  );
};
