import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark bg-[#06090A] min-h-screen text-white">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="bg-[#06090A]">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[#06090A]/80 px-6 backdrop-blur-xl">
            <h1 className="text-sm font-semibold tracking-[0.22em] text-white/60 uppercase">
              Dashboard Administration
            </h1>
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Voir le site
            </Link>
          </header>
          <main className="p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

