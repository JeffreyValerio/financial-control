import { Toaster } from "../ui/toaster";
import { Balance } from "./Balance";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      {children}
      <Balance />
      <Toaster />
    </div>
  );
};
