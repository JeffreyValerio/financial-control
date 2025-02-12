import { Providers, SidebarAdmin } from "@/components";

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen min-w-full flex-col bg-muted/40">
      <SidebarAdmin />
      <main className="sm:ml-14 flex items-center content-center justify-center min-h-[calc(100vh-7rem)] relative px-4">
        <Providers>{children}</Providers>
      </main>
    </div>
  );
}
