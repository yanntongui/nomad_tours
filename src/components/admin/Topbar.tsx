"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Bell, Search, ChevronDown, LogOut } from "lucide-react";
import { useAdminRole } from "@/context/AdminRoleContext";
import { createClient } from "@/lib/supabase/client";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useNotifications, useUnreadCount, markRead, markAllRead } from "@/lib/admin/store/notifications-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb } from "@/components/admin/Breadcrumb";
import { COMMAND_PALETTE_OPEN_EVENT } from "@/components/admin/CommandPalette";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { role, user } = useAdminRole();
  const router = useRouter();
  const notifications = useNotifications();
  const unreadCount = useUnreadCount();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-stone-200 bg-white px-4 sm:px-6 dark:border-stone-800 dark:bg-stone-900">
      <div className="hidden sm:block flex-1 min-w-0">
        <Breadcrumb />
      </div>

      <button
        onClick={() => window.dispatchEvent(new Event(COMMAND_PALETTE_OPEN_EVENT))}
        className="relative hidden lg:flex w-64 items-center gap-2 rounded-md border border-stone-200 bg-stone-50 py-1.5 pl-8 pr-3 text-xs text-stone-500 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
      >
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
        <span className="flex-1 text-left">Rechercher...</span>
        <kbd className="rounded border border-stone-300 bg-white px-1.5 py-0.5 text-[10px] font-medium text-stone-400 dark:border-stone-600 dark:bg-stone-900">
          ⌘K
        </kbd>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-luxe-terracotta" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-2 py-1">
            <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="text-[11px] font-medium text-luxe-terracotta hover:underline"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-2 py-6 text-center text-sm text-stone-400">Aucune notification.</p>
            )}
            {notifications.map((n) => {
              const content = (
                <div className="flex items-start gap-2">
                  <span
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      n.read ? "bg-transparent" : "bg-luxe-terracotta"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-xs", n.read ? "text-stone-500 dark:text-stone-400" : "font-semibold text-stone-800 dark:text-stone-100")}>
                      {n.title}
                    </p>
                    {n.description && <p className="truncate text-[11px] text-stone-400">{n.description}</p>}
                    <p className="text-[10px] text-stone-400">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                </div>
              );
              return (
                <DropdownMenuItem key={n.id} onSelect={() => markRead(n.id)} asChild={!!n.href} className="items-start">
                  {n.href ? (
                    <Link href={n.href} className="flex w-full">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

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
          <DropdownMenuLabel>
            <span className="block text-xs font-semibold text-stone-800 dark:text-stone-100">{user.name}</span>
            <span className="block text-[11px] font-normal text-stone-500 dark:text-stone-400">{user.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center gap-2">
              Retour au site
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleSignOut} className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <LogOut className="h-3.5 w-3.5" />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
