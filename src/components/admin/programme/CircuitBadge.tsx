"use client";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ArrowRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  DepartureWithCircuit,
  computeFillRate,
  getDaysUntil,
  getTemporalStatus,
  isAtRisk,
} from "@/lib/admin/programme-annuel";

function countdownStyle(daysUntil: number): string {
  if (daysUntil < 7) return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800";
  if (daysUntil < 30) return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800";
  return "bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700";
}

export function CircuitBadge({
  departure,
  now,
  activeTripId,
}: {
  departure: DepartureWithCircuit;
  now: Date;
  activeTripId?: string;
}) {
  const status = getTemporalStatus(new Date(departure.date), now);
  const daysUntil = getDaysUntil(departure.date, now);
  const fillRate = computeFillRate(departure);
  const risk = isAtRisk(departure, now);
  const activeTrip = status === "CURRENT" && activeTripId ? { id: activeTripId } : undefined;

  return (
    <div
      className={cn(
        "rounded-xl border p-3 transition-opacity",
        status === "PAST" && "border-stone-200 bg-stone-50 opacity-60 dark:border-stone-800 dark:bg-stone-900/50",
        status === "CURRENT" && "border-luxe-terracotta/40 bg-luxe-terracotta/5 ring-1 ring-luxe-terracotta/30",
        status === "UPCOMING" && "border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">{departure.circuit.title}</p>
          <p className="truncate text-xs text-stone-500 dark:text-stone-400">
            {departure.circuit.destinationName} · {CATEGORY_LABELS[departure.circuit.category]}
          </p>
        </div>
        {status === "PAST" && <CheckCircle2 className="h-4 w-4 shrink-0 text-stone-400" />}
        {status === "CURRENT" && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-luxe-terracotta animate-pulse" />}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {daysUntil > 0 && (
          <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", countdownStyle(daysUntil))}>
            J-{daysUntil}
          </span>
        )}
        <span className="flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2 py-0.5 text-[11px] font-medium text-stone-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">
          <Users className="h-3 w-3" />
          {Math.round(fillRate * 100)}% rempli
        </span>
        {risk && (
          <Link
            href={`/admin/circuits/${departure.circuit.id}`}
            className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/40 dark:text-red-300"
            title="Remplissage faible à l'approche du départ"
          >
            <AlertTriangle className="h-3 w-3" />
            À risque
          </Link>
        )}
      </div>

      {activeTrip && (
        <Link
          href={`/admin/voyages/${activeTrip.id}`}
          className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-luxe-terracotta hover:underline"
        >
          Voir les tâches de ce voyage
          <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}
