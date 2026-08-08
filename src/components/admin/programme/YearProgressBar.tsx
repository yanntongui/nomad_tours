import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function YearProgressBar({ now, year }: { now: Date; year: number }) {
  const start = new Date(year, 0, 1).getTime();
  const end = new Date(year + 1, 0, 1).getTime();
  const elapsed = Math.min(1, Math.max(0, (now.getTime() - start) / (end - start)));
  const pct = Math.round(elapsed * 100);
  const currentMonthLabel = format(now, "MMMM", { locale: fr });

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        <span>Année {year}</span>
        <span className="text-luxe-terracotta">{pct}% écoulés</span>
      </div>
      <div className="relative mt-3 h-3 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-luxe-terracotta/60 to-luxe-terracotta transition-all"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-stone-900 dark:bg-white"
          style={{ left: `calc(${pct}% - 2px)` }}
          title={`Aujourd'hui — ${currentMonthLabel}`}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-400">
        <span>Janvier</span>
        <span className="capitalize text-stone-600 dark:text-stone-300 font-medium">{currentMonthLabel}</span>
        <span>Décembre</span>
      </div>
    </div>
  );
}
