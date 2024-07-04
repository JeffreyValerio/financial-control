import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex w-full items-center justify-center min-h-[calc(100vh-7rem)]">
      <SignIn />
    </div>
  );
}
