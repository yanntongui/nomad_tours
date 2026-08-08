import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";
import { DepartureWithCircuit, computeFillRate, getDaysUntil } from "@/lib/admin/programme-annuel";

export interface RiskItem {
  departure: DepartureWithCircuit;
  reasons: string[];
}

export function RiskModeView({ items, now }: { items: RiskItem[]; now: Date }) {
  const sorted = [...items].sort((a, b) => a.departure.date.localeCompare(b.departure.date));

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4 dark:border-red-900 dark:bg-red-950/20">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-300">
        <AlertTriangle className="h-4 w-4" />
        Départs à risque ({sorted.length})
      </div>
      {sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-red-500/70">Aucun départ à risque pour le moment. 🎉</p>
      ) : (
        <div className="space-y-2">
          {sorted.map(({ departure, reasons }) => (
            <div
              key={departure.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-red-200 bg-white p-3 dark:border-red-900 dark:bg-stone-900"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">{departure.circuit.title}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {departure.circuit.destinationName} · {format(new Date(departure.date), "d MMM yyyy", { locale: fr })} · J-
                  {getDaysUntil(departure.date, now)} · {Math.round(computeFillRate(departure) * 100)}% rempli
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {reasons.map((reason) => (
                  <span
                    key={reason}
                    className="rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-300"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
