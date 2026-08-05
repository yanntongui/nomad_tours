import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  changePct?: number;
  helper?: string;
}

export function KpiCard({ label, value, icon: Icon, changePct, helper }: KpiCardProps) {
  const positive = (changePct ?? 0) >= 0;
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxe-terracotta/10 text-luxe-terracotta">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold text-stone-900 dark:text-stone-100">{value}</p>
      <div className="mt-1 flex items-center gap-1.5 text-xs">
        {changePct !== undefined && (
          <span className={cn("flex items-center gap-0.5 font-semibold", positive ? "text-emerald-600" : "text-red-600")}>
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {positive ? "+" : ""}
            {changePct}%
          </span>
        )}
        {helper && <span className="text-stone-400 dark:text-stone-500">{helper}</span>}
      </div>
    </div>
  );
}
