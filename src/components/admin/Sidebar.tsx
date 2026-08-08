"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarRange,
  Plane,
  PlaneTakeoff,
  MapPinned,
  FileCheck2,
  PartyPopper,
  Users,
  Headphones,
  Gift,
  Wallet,
  FileText,
  ShieldCheck,
  Settings,
  FileClock,
  FileBarChart2,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useAdminRole } from "@/context/AdminRoleContext";
import { AdminRole } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: AdminRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "AGENT"] },
  { label: "Réservations", href: "/admin/reservations", icon: CalendarCheck, roles: ["SUPER_ADMIN", "AGENT"] },
  { label: "Voyages en cours", href: "/admin/voyages", icon: Plane, roles: ["SUPER_ADMIN", "AGENT", "GUIDE"] },
  { label: "Rapports de voyage", href: "/admin/voyages/rapports", icon: FileBarChart2, roles: ["SUPER_ADMIN", "AGENT"] },
  { label: "Destinations", href: "/admin/destinations", icon: MapPinned, roles: ["SUPER_ADMIN", "AGENT"] },
  { label: "Circuits", href: "/admin/circuits", icon: MapPinned, roles: ["SUPER_ADMIN", "AGENT"] },
  { label: "Programme annuel", href: "/admin/programme-annuel", icon: CalendarRange, roles: ["SUPER_ADMIN", "AGENT"] },
  { label: "Demandes de Visa", href: "/admin/visas", icon: FileCheck2, roles: ["SUPER_ADMIN", "AGENT"] },
  { label: "Événementiel", href: "/admin/evenementiel", icon: PartyPopper, roles: ["SUPER_ADMIN", "AGENT"] },
  { label: "Clients", href: "/admin/clients", icon: Users, roles: ["SUPER_ADMIN", "AGENT"] },
  { label: "Support & Réclamations", href: "/admin/support", icon: Headphones, roles: ["SUPER_ADMIN", "AGENT"] },
  { label: "Vols", href: "/admin/vols", icon: PlaneTakeoff, roles: ["SUPER_ADMIN", "AGENT"] },
  { label: "Fidélité & VIP", href: "/admin/fidelite", icon: Gift, roles: ["SUPER_ADMIN", "AGENT"] },
  { label: "Paiements", href: "/admin/paiements", icon: Wallet, roles: ["SUPER_ADMIN"] },
  { label: "Contenu (CMS)", href: "/admin/contenu", icon: FileText, roles: ["SUPER_ADMIN"] },
  { label: "Utilisateurs & Rôles", href: "/admin/utilisateurs", icon: ShieldCheck, roles: ["SUPER_ADMIN"] },
  { label: "Journal d'audit", href: "/admin/journal", icon: FileClock, roles: ["SUPER_ADMIN"] },
  { label: "Paramètres", href: "/admin/parametres", icon: Settings, roles: ["SUPER_ADMIN"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useAdminRole();
  const [collapsed, setCollapsed] = React.useState(false);

  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const activeHref = items
    .map((item) => item.href)
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 border-r border-stone-200 bg-admin-bg h-screen sticky top-0 transition-all dark:border-stone-800 dark:bg-stone-950",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center gap-2 px-4 h-16 border-b border-stone-200 shrink-0 dark:border-stone-800">
        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-white shadow-sm">
          <Image src="/nomad-logo.jpg" alt="Nomad Tours" width={32} height={32} className="w-full h-full object-cover" />
        </div>
        {!collapsed && <span className="text-sm font-bold text-stone-800 dark:text-stone-100 truncate">Nomad Tours Admin</span>}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {items.map((item) => {
          const active = item.href === activeHref;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-luxe-terracotta/10 text-luxe-terracotta-dark dark:text-luxe-terracotta"
                  : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active && "text-luxe-terracotta")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center gap-2 px-4 h-12 border-t border-stone-200 text-xs text-stone-500 hover:bg-stone-100 shrink-0 dark:border-stone-800 dark:text-stone-400 dark:hover:bg-stone-800"
      >
        {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        {!collapsed && "Réduire"}
      </button>
    </aside>
  );
}
