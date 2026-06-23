"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Layers,
  Users,
  Settings,
  LogOut,
  Home,
  ImageIcon,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Dashboard",
    url: "/hcp-bo-7x9k2m",
    icon: LayoutDashboard,
  },
  {
    title: "Gestion des Pôles",
    url: "/hcp-bo-7x9k2m/poles",
    icon: Layers,
  },
  {
    title: "Images du site",
    url: "/hcp-bo-7x9k2m/images",
    icon: ImageIcon,
  },
  {
    title: "Offres Stratégie",
    url: "/hcp-bo-7x9k2m/offres",
    icon: FileText,
  },
  {
    title: "Demandes Contact",
    url: "/hcp-bo-7x9k2m/contacts",
    icon: Users,
  },
];

const secondaryItems = [
  {
    title: "Paramètres",
    url: "/hcp-bo-7x9k2m/settings",
    icon: Settings,
  },
  {
    title: "Retour au site",
    url: "/",
    icon: Home,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-white/10 bg-[#06090A] text-white">
      <SidebarHeader className="border-b border-white/10 bg-[#06090A] p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/15 text-emerald-300 shadow-[0_18px_60px_-24px_rgba(16,185,129,0.75)]">
            <span className="text-xs font-bold uppercase">HCP</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white">ADMIN PANEL</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">Digital Labo</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="text-white/70 transition-colors hover:bg-emerald-400/10 hover:text-white data-[active=true]:bg-emerald-400/15 data-[active=true]:text-emerald-200 data-[active=true]:shadow-[inset_3px_0_0_rgba(52,211,153,0.95)]"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Système</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="text-white/70 transition-colors hover:bg-emerald-400/10 hover:text-white data-[active=true]:bg-emerald-400/15 data-[active=true]:text-emerald-200 data-[active=true]:shadow-[inset_3px_0_0_rgba(52,211,153,0.95)]"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-red-300/80 transition-colors hover:bg-red-400/10 hover:text-red-200">
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}



