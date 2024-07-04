import Link from "next/link";

import { cn } from "@/lib/utils";
import { Coins, Tags, Wallet } from "lucide-react";
import { currencyFormat } from "@/lib/currency-format";
import { GetBalance } from "@/actions";

export const Balance = async () => {
  const { balance } = await GetBalance();
  return (
    <div className="fixed md:absolute bottom-0 md:bottom-2 right-2 text-accent flex gap-x-1">
      <div className="bg-primary py-2 px-4 rounded-md flex flex-col justify-center">
        <span className="font-bold flex items-center gap-x-1">
          <Wallet size={22} />
          Saldo disponible
        </span>
        <span
          className={cn("font-bold text-3xl", {
            "text-green-600": Number(balance) >= 0,
            "text-[#ca1515]": Number(balance) < 0,
          })}
        >
          {currencyFormat(Number(balance))}
        </span>
      </div>

      <div className="flex flex-col gap-y-1 items-center justify-center">
        <div className="rounded-md bg-primary hover:bg-green-600 p-2 text-accent">
          <Link href={"/categories"}>
            <Tags className="flex-shrink-0" />
          </Link>
        </div>
        <div className="rounded-md bg-primary hover:bg-green-600 p-2 text-accent">
          <Link href={"/transactions"}>
            <Coins className="flex-shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
};
