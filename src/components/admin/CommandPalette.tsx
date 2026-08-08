"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAdminRole } from "@/context/AdminRoleContext";
import { NAV_ITEMS } from "@/components/admin/Sidebar";
import { AdminRole } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

interface QuickAction {
  label: string;
  href: string;
  roles: AdminRole[];
}

export const COMMAND_PALETTE_OPEN_EVENT = "nomad-admin:open-command-palette";

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Nouvelle réservation", href: "/admin/reservations/new", roles: ["SUPER_ADMIN", "AGENT"] },
  { label: "Nouveau circuit", href: "/admin/circuits/new", roles: ["SUPER_ADMIN", "AGENT"] },
  { label: "Nouvelle destination", href: "/admin/destinations/new", roles: ["SUPER_ADMIN", "AGENT"] },
  { label: "Nouvel article de blog", href: "/admin/contenu/blog/new", roles: ["SUPER_ADMIN"] },
];

export function CommandPalette() {
  const router = useRouter();
  const { role } = useAdminRole();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    function onOpenRequest() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(COMMAND_PALETTE_OPEN_EVENT, onOpenRequest);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(COMMAND_PALETTE_OPEN_EVENT, onOpenRequest);
    };
  }, []);

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  const navResults = React.useMemo(
    () => NAV_ITEMS.filter((item) => item.roles.includes(role) && item.label.toLowerCase().includes(query.toLowerCase())),
    [role, query]
  );
  const actionResults = React.useMemo(
    () => QUICK_ACTIONS.filter((a) => a.roles.includes(role) && a.label.toLowerCase().includes(query.toLowerCase())),
    [role, query]
  );
  const total = navResults.length + actionResults.length;

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, total - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex < navResults.length) {
        const item = navResults[activeIndex];
        if (item) go(item.href);
      } else {
        const action = actionResults[activeIndex - navResults.length];
        if (action) go(action.href);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[18%] max-w-lg -translate-y-0 gap-0 overflow-hidden p-0">
        <div className="flex items-center gap-2 border-b border-stone-200 px-3 dark:border-stone-800">
          <Search className="h-4 w-4 shrink-0 text-stone-400" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Rechercher une page, une action..."
            className="h-12 border-0 px-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {total === 0 && <p className="px-2 py-6 text-center text-sm text-stone-400">Aucun résultat.</p>}
          {navResults.length > 0 && (
            <div className="mb-1">
              <p className="px-2 py-1 text-[11px] font-semibold uppercase text-stone-400">Navigation</p>
              {navResults.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => go(item.href)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm",
                      i === activeIndex
                        ? "bg-luxe-terracotta/10 text-luxe-terracotta-dark dark:text-luxe-terracotta"
                        : "text-stone-700 dark:text-stone-300"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
          {actionResults.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[11px] font-semibold uppercase text-stone-400">Actions rapides</p>
              {actionResults.map((action, i) => {
                const idx = navResults.length + i;
                return (
                  <button
                    key={action.href}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => go(action.href)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm",
                      idx === activeIndex
                        ? "bg-luxe-terracotta/10 text-luxe-terracotta-dark dark:text-luxe-terracotta"
                        : "text-stone-700 dark:text-stone-300"
                    )}
                  >
                    <Plus className="h-4 w-4 shrink-0" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-stone-200 px-3 py-2 text-[11px] text-stone-400 dark:border-stone-800">
          <span>↑↓ naviguer</span>
          <span>↵ ouvrir</span>
          <span>esc fermer</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
