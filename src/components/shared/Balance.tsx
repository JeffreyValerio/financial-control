import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { currencyFormat } from "@/lib/currency-format";
import { currentUser } from "@clerk/nextjs/server";
import { GetBalance } from "@/actions";
import { Wallet } from "lucide-react";

export const Balance = async () => {
  const { balance } = await GetBalance();
  const user = await currentUser();

  if (!user) return <></>;

  return (
    <Card className="fixed bottom-2 right-2">
      <CardHeader className="pb-0">
        <CardTitle className="font-bold flex items-center gap-x-2">
          <Wallet size={22} />
          Saldo disponible
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-0">
        <span
          className={cn("font-bold text-3xl", {
            "text-green-600": Number(balance) >= 0,
            "text-[#ca1515]": Number(balance) < 0,
          })}
        >
          {currencyFormat(Number(balance))}
        </span>
      </CardContent>
    </Card>
  );
};
