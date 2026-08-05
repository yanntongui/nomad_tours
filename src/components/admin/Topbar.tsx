"use client";
import * as React from "react";
import Link from "next/link";
import { Bell, Search, ChevronDown, LogOut } from "lucide-react";
import { useAdminRole } from "@/context/AdminRoleContext";
import { AdminRole } from "@/lib/admin/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb } from "@/components/admin/Breadcrumb";

const ROLE_OPTIONS: { role: AdminRole; label: string }[] = [
  { role: "SUPER_ADMIN", label: "Super Admin" },
  { role: "AGENT", label: "Agent commercial" },
  { role: "GUIDE", label: "Guide / Accompagnateur" },
];

export function Topbar() {
  const { role, user, setRole } = useAdminRole();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-stone-200 bg-white px-4 sm:px-6 dark:border-stone-800 dark:bg-stone-900">
      <div className="hidden sm:block flex-1 min-w-0">
        <Breadcrumb />
      </div>

      <div className="relative hidden lg:block w-64">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
        <input
          placeholder="Rechercher... (Cmd+K bientôt)"
          disabled
          className="w-full rounded-md border border-stone-200 bg-stone-50 py-1.5 pl-8 pr-3 text-xs text-stone-500 placeholder:text-stone-400 cursor-not-allowed dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400"
        />
      </div>

      <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800">
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-luxe-terracotta" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-stone-100 dark:hover:bg-stone-800">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
              style={{ backgroundColor: user.avatarColor }}
            >
              {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </span>
            <span className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-xs font-semibold text-stone-800 dark:text-stone-100">{user.name}</span>
              <StatusBadge status={role} />
            </span>
            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-stone-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Basculer de rôle (démo)</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ROLE_OPTIONS.map((opt) => (
            <DropdownMenuItem key={opt.role} onSelect={() => setRole(opt.role)} className={opt.role === role ? "bg-stone-100 dark:bg-stone-800" : ""}>
              {opt.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center gap-2">
              <LogOut className="h-3.5 w-3.5" />
              Retour au site
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
