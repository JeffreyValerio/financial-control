import { Type } from "./Type";

export interface ITransaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  type: any;
  notes: string;
  categoryId: string;
}
