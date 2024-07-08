import { ICategory } from "./Category";
import { Type } from "./Type";

export interface ITransaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  type: any;
  notes: string;
  categoryId: string;
  category: ICategory;
  createdAt?: Date;
  updatedAt?: Date;
}
