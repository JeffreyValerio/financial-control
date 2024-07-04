import { GetCategories, GetTransactionById } from "@/actions";
import { TransactionForm } from "@/components";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Editar Movimiento",
  description: "Editar Movimiento",
};
interface Props {
  params: {
    id: string;
  };
}
export default async function TransactionPage({ params: { id } }: Props) {
  const [{ categories }, transaction] = await Promise.all([
    GetCategories(),
    GetTransactionById({ id }),
  ]);

  if (!transaction && id !== "new") redirect("/transactions");

  const title = id === "new" ? "Nuevo movimiento" : "Editar movimiento";

  return (
    <TransactionForm
      title={title}
      categories={categories}
      transaction={transaction ?? {}}
    />
  );
}
