import { Providers, SidebarAdmin } from "@/components";

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarAdmin />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="flex w-full justify-center min-h-[calc(100vh-7rem)] p-8">
          <Providers>{children}</Providers>
        </main>
      </div>
    </div>
  );
}
