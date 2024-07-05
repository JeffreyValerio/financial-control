import Link from "next/link";

import { Coins, Tags, Wallet } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "./ModeToggle";
import { SignedIn, UserButton, SignInButton, SignedOut } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface iMenu {
  label: string;
  href: string;
  icon: JSX.Element;
}
const menu: iMenu[] = [
  {
    label: "Categorías",
    href: "categories",
    icon: <Tags className="h-5 w-5" />,
  },
  {
    label: "Movimientos",
    href: "transactions",
    icon: <Coins className="h-5 w-5" />,
  },
];

export const SidebarAdmin = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        <Button size={"icon"}>
          <Wallet />
          <span className="sr-only">Financial Control</span>
        </Button>
        <TooltipProvider>
          {menu.map((item, idx) => (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <Link
                  href={`/${item.href}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  {item.icon}
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
        <TooltipProvider>
          <ModeToggle />
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </nav>
    </aside>
  );
};
