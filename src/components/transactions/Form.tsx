"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Controller, useForm } from "react-hook-form";
import { CreateUpdateTransaction } from "@/actions";
import { ICategory, ITransaction } from "@/interfaces";
import { Input } from "../ui/input";
import { CalendarIcon, LoaderIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import Link from "next/link";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Delete } from "./DeleteButton";

interface Props {
  categories: ICategory[];
  transaction: Partial<ITransaction>;
  title: string;
}

interface FormInputs {
  amount: number;
  categoryId: string;
  date: string;
  description: string;
  notes: string;
  type: string;
}

export const TransactionForm = ({ categories, transaction, title }: Props) => {
  const router = useRouter();
  const [formModified, setFormModified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    now.setMilliseconds(0); // Remove milliseconds
    const isoString = now.toISOString();
    return isoString.substring(0, isoString.length - 1); // Remove the 'Z' at the end
  };

  const { handleSubmit, register, control, watch } = useForm<FormInputs>({
    defaultValues: {
      ...transaction,
      date: transaction.date
        ? new Date(transaction.date).toISOString()
        : getCurrentDateTimeLocal(),
    },
  });

  const selectedType = watch("type");

  const handleInputChange = () => {
    setFormModified(true);
  };
  const onSubmit = async (data: FormInputs) => {
    setLoading(true);

    try {
      const formData = new FormData();

      const { ...transactionToSave } = data;

      if (transaction.id) formData.append("id", transaction.id);
      formData.append("date", new Date(transactionToSave.date).toISOString());
      formData.append("amount", `${transactionToSave.amount}`);
      formData.append(
        "description",
        transactionToSave.description.toUpperCase().trim()
      );
      formData.append("type", transactionToSave.type);
      formData.append("notes", transactionToSave.notes);
      formData.append("categoryId", transactionToSave.categoryId);

      const {
        ok,
        message,
        transaction: updatedTransaction,
      } = await CreateUpdateTransaction(formData);

      if (ok) {
        console.log("READY");
        console.log({ message });
        // router.replace(`/transactions/${updatedTransaction?.id}`);
        router.replace(`/transactions`);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {/* <CardDescription>{currencyFormat(balance)}</CardDescription> */}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} onChange={handleInputChange}>
          <section>
            <div className="flex flex-col">
              <label htmlFor="date">Fecha</label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-[280px] justify-start text-left font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Seleccione una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          field.onChange(date ? date.toISOString() : "");
                          setFormModified(true);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="amount">Monto</label>
              <Input
                type="number"
                step={0.01}
                {...register("amount", { required: true })}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description">Descripción</label>
              <Textarea
                className="uppercase"
                {...register("description", {
                  required: "La descripción es un campo requerido",
                })}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="type">Tipo</label>
              <select
                {...register("type")}
                className="outline-none focus:ring-1 p-2 rounded text-sm"
              >
                <option value="">Tipo de movimiento</option>
                <option value="INCOME">INGRESO</option>
                <option value="EXPENSE">EGRESO</option>
              </select>
            </div>
          </section>

          {selectedType && (
            <div className="flex flex-col mb-2">
              <label htmlFor="categoryId" className="input-label">
                Categoría
              </label>
              <select
                className="outline-none focus:ring-1 p-2 rounded text-sm"
                {...register("categoryId", { required: true })}
              >
                {categories?.map((category: ICategory) => (
                  <React.Fragment key={category.id}>
                    {category.type === selectedType && (
                      <option value={category.id}>{category.name}</option>
                    )}
                  </React.Fragment>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col">
            <label htmlFor="notes">Notas</label>
            <Textarea {...register("notes")} />
          </div>

          <div className="flex justify-between items-center gap-2 pt-8">
            <Button className="w-full" disabled={!formModified || loading}>
              {loading ? (
                <LoaderIcon strokeWidth={1} className={"animate-spin"} />
              ) : (
                <p>{title}</p>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button onClick={() => router.back()}>Regresar</Button>
        {transaction.id && <Delete id={transaction.id} />}
      </CardFooter>
    </Card>
  );
};
