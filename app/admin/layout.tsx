import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0F1115] min-h-screen text-white">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="bg-[#0F1115]">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-6">
            <h1 className="text-sm font-semibold tracking-[0.22em] text-white/60 uppercase">
              Dashboard Administration
            </h1>
          </header>
          <main className="p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
