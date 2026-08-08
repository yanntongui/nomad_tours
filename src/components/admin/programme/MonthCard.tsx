import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DepartureWithCircuit, TemporalStatus, getMonthStatus } from "@/lib/admin/programme-annuel";
import { CircuitBadge } from "@/components/admin/programme/CircuitBadge";

const HEADER_STYLE: Record<TemporalStatus, string> = {
  PAST: "bg-stone-400 text-white",
  CURRENT: "bg-luxe-terracotta text-white ring-2 ring-luxe-terracotta ring-offset-2 dark:ring-offset-stone-950",
  UPCOMING: "bg-stone-900 text-white",
};

export function MonthCard({
  month,
  year,
  departures,
  now,
  activeTripByCircuit,
}: {
  month: number;
  year: number;
  departures: DepartureWithCircuit[];
  now: Date;
  activeTripByCircuit: Map<string, { id: string }>;
}) {
  const status = getMonthStatus(month, year, now);
  const label = format(new Date(year, month, 1), "MMMM", { locale: fr });
  const sorted = [...departures].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className={cn("flex items-center justify-between px-4 py-2.5", HEADER_STYLE[status])}>
        <span className="capitalize text-sm font-semibold">{label}</span>
        <div className="flex items-center gap-2">
          {status === "CURRENT" && <span className="h-2 w-2 rounded-full bg-white animate-pulse" />}
          <span className="text-xs font-medium opacity-90">{sorted.length} départ{sorted.length > 1 ? "s" : ""}</span>
        </div>
      </div>
      <div className="space-y-2 p-3">
        {sorted.length === 0 ? (
          <p className="py-6 text-center text-xs text-stone-400">Aucun départ programmé.</p>
        ) : (
          sorted.map((d) => (
            <CircuitBadge
              key={d.id}
              departure={d}
              now={now}
              activeTripId={activeTripByCircuit.get(d.circuit.id)?.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
