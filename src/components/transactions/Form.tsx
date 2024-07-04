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
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Delete } from "./DeleteButton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

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

  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    now.setMilliseconds(0); // Remove milliseconds
    const isoString = now.toISOString();
    return isoString.substring(0, isoString.length - 1); // Remove the 'Z' at the end
  };

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
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
        router.replace(`/transactions/${updatedTransaction?.id}`);
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
              <label
                htmlFor="amount"
                className={cn("mt-2", {
                  "text-[#ca1515]": errors.amount,
                })}
              >
                Monto
              </label>
              <Input
                type="number"
                step={0.01}
                {...register("amount", { required: true })}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="description"
                className={cn("mt-2", {
                  "text-[#ca1515]": errors.description,
                })}
              >
                Descripción
              </label>
              <Textarea
                className="uppercase"
                {...register("description", {
                  required: "La descripción es un campo requerido",
                })}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="type"
                className={cn("mt-2", {
                  "text-[#ca1515]": errors.type,
                })}
              >
                Tipo
              </label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
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

          {selectedType && (
            <div className="flex flex-col mb-2">
              <label
                htmlFor="categoryId"
                className={cn("mt-2", {
                  "text-[#ca1515]": errors.categoryId,
                })}
              >
                Categoría
              </label>

              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category: ICategory) => (
                        <SelectGroup key={category.id}>
                          {category.type === selectedType && (
                            <SelectItem value={category.id}>
                              {category.name}
                            </SelectItem>
                          )}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          <div className="flex flex-col">
            <label htmlFor="notes" className="mt-2">
              Notas
            </label>
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
