"use client";
import Link from "next/link";
import { Bell, AlertTriangle, Megaphone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SalesOpeningRecommendation } from "@/lib/admin/programme-annuel";

export function NotificationsBell({
  recommendations,
  atRiskCount,
  onViewRisk,
}: {
  recommendations: SalesOpeningRecommendation[];
  atRiskCount: number;
  onViewRisk: () => void;
}) {
  const total = recommendations.length + (atRiskCount > 0 ? 1 : 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800">
          <Bell className="h-4 w-4" />
          {total > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-luxe-terracotta px-1 text-[10px] font-bold text-white">
              {total}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Recommandations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {total === 0 && <p className="px-2 py-6 text-center text-sm text-stone-400">Rien à signaler.</p>}
          {atRiskCount > 0 && (
            <DropdownMenuItem onSelect={onViewRisk} className="items-start gap-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
              <span className="text-xs">
                <span className="font-semibold text-stone-800 dark:text-stone-100">{atRiskCount} départ(s) à risque</span>
                <br />
                <span className="text-stone-400">Remplissage faible à l&apos;approche du départ</span>
              </span>
            </DropdownMenuItem>
          )}
          {recommendations.map(({ departure, monthsBefore }) => (
            <DropdownMenuItem key={departure.id} asChild className="items-start gap-2">
              <Link href={`/admin/circuits/${departure.circuit.id}`} className="flex w-full items-start gap-2">
                <Megaphone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-luxe-terracotta" />
                <span className="text-xs">
                  <span className="font-semibold text-stone-800 dark:text-stone-100">Ouverture des ventes recommandée</span>
                  <br />
                  <span className="text-stone-400">
                    {departure.circuit.title} — {monthsBefore} mois avant départ
                  </span>
                </span>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
