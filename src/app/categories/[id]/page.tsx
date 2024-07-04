import { GetCategoryById } from "@/actions";
import { CategoryForm } from "@/components";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}
export default async function CategoryPage({ params: { id } }: Props) {
  const category = await GetCategoryById({ id });

  if (!category && id !== "new") redirect("/categories");

  const title = id === "new" ? "Nueva categoría" : "Editar categoría";

  return <CategoryForm title={title} category={category ?? {}} />;
}
