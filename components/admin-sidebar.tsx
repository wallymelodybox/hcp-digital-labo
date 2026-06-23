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
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Gestion des Pôles",
    url: "/admin/poles",
    icon: Layers,
  },
  {
    title: "Images du site",
    url: "/admin/images",
    icon: ImageIcon,
  },
  {
    title: "Offres Stratégie",
    url: "/admin/offres",
    icon: FileText,
  },
  {
    title: "Demandes Contact",
    url: "/admin/contacts",
    icon: Users,
  },
];

const secondaryItems = [
  {
    title: "Paramètres",
    url: "/admin/settings",
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
    <Sidebar className="border-r border-white/10 bg-[#12141A]">
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
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
                    className="text-white/70 transition-colors hover:bg-white/5 hover:text-white"
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
                    className="text-white/70 transition-colors hover:bg-white/5 hover:text-white"
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
            <SidebarMenuButton className="text-red-400 transition-colors hover:bg-red-400/10 hover:text-red-300">
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}


