"use client";

import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { LoaderIcon, PlusCircle } from "lucide-react";
import { useState } from "react";
import { CreateUpdateCategory } from "@/actions";
import { useToast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

interface FormInputs {
  name: string;
  budget: number;
  description: string;
  type: string;
}

export const TableForm = () => {
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({});
  const [formModified, setFormModified] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const handleInputChange = () => {
    setFormModified(true);
  };

  const onSubmit = async (data: FormInputs) => {
    setLoading(true);

    try {
      const formData = new FormData();

      const { ...categoryToSave } = data;

      formData.append("name", categoryToSave.name);
      formData.append("budget", `${categoryToSave.budget}`);
      formData.append("description", categoryToSave.description);
      formData.append("type", categoryToSave.type);

      const { ok, message } = await CreateUpdateCategory(formData);

      if (!ok) {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "¡Éxito!",
          description: message,
          variant: "success",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      reset();
      setFormModified(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onChange={handleInputChange}
      className="p-4 border rounded-md w-fit shadow-xl"
    >
      <section className="flex flex-wrap items-center gap-x-4">
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className={cn("", {
              "text-[#ca1515]": errors.name,
            })}
          >
            Nombre
          </label>
          <Input
            {...register("name", {
              required: "El nombre de la categoría es requerido",
            })}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="budget"
            className={cn("", {
              "text-[#ca1515]": errors.budget,
            })}
          >
            Presupuesto
          </label>
          <Input
            type="number"
            step={0.01}
            {...register("budget", { required: true })}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="description"
            className={cn("", {
              "text-[#ca1515]": errors.description,
            })}
          >
            Descripción
          </label>
          <Input
            {...register("description", {
              required: "La descripción es un campo requerido",
            })}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="type"
            className={cn("", {
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
                <SelectTrigger className="w-fit">
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
        <Button disabled={!formModified || loading} className="self-end">
          {loading ? (
            <LoaderIcon strokeWidth={1} className={"animate-spin"} />
          ) : (
            <PlusCircle size={18} />
          )}
        </Button>
      </section>
    </form>
  );
};
