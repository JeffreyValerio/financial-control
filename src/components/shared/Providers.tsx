import { Balance } from "./Balance";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      {children}
      <Balance />
    </div>
  );
};
