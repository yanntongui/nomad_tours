"use client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search, CalendarDays, LayoutGrid, List, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircuitCategory } from "@/lib/admin/types";
import { CATEGORY_LABELS, Granularity } from "@/lib/admin/programme-annuel";

const GRANULARITIES: { value: Granularity; label: string }[] = [
  { value: "ANNEE", label: "Année" },
  { value: "SEMESTRE", label: "Semestre" },
  { value: "TRIMESTRE", label: "Trimestre" },
  { value: "MOIS", label: "Mois" },
];

const CATEGORIES = Object.keys(CATEGORY_LABELS) as CircuitCategory[];

function windowOptionLabel(granularity: Granularity, index: number, year: number): string {
  if (granularity === "SEMESTRE") return index === 0 ? "S1 (Jan–Juin)" : "S2 (Juil–Déc)";
  if (granularity === "TRIMESTRE") return `T${index + 1}`;
  if (granularity === "MOIS") return format(new Date(year, index, 1), "MMMM", { locale: fr });
  return "";
}

function windowCount(granularity: Granularity): number {
  if (granularity === "SEMESTRE") return 2;
  if (granularity === "TRIMESTRE") return 4;
  if (granularity === "MOIS") return 12;
  return 1;
}

export function ControlsBar({
  year,
  granularity,
  setGranularity,
  selectedWindow,
  setSelectedWindow,
  search,
  setSearch,
  activeCategories,
  toggleCategory,
  viewMode,
  setViewMode,
  onGoToToday,
  compareYoY,
  setCompareYoY,
  riskModeOn,
  setRiskModeOn,
  atRiskCount,
}: {
  year: number;
  granularity: Granularity;
  setGranularity: (g: Granularity) => void;
  selectedWindow: number;
  setSelectedWindow: (w: number) => void;
  search: string;
  setSearch: (s: string) => void;
  activeCategories: Set<CircuitCategory>;
  toggleCategory: (c: CircuitCategory) => void;
  viewMode: "detailed" | "compact";
  setViewMode: (v: "detailed" | "compact") => void;
  onGoToToday: () => void;
  compareYoY: boolean;
  setCompareYoY: (v: boolean) => void;
  riskModeOn: boolean;
  setRiskModeOn: (v: boolean) => void;
  atRiskCount: number;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg bg-stone-100 p-1 dark:bg-stone-800">
          {GRANULARITIES.map((g) => (
            <button
              key={g.value}
              onClick={() => {
                setGranularity(g.value);
                setSelectedWindow(0);
              }}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                granularity === g.value
                  ? "bg-white text-luxe-terracotta shadow-sm dark:bg-stone-900"
                  : "text-stone-500 hover:text-stone-700 dark:text-stone-400"
              )}
            >
              {g.label}
            </button>
          ))}
        </div>

        {granularity !== "ANNEE" && (
          <div className="flex items-center gap-1 overflow-x-auto">
            {Array.from({ length: windowCount(granularity) }, (_, i) => (
              <button
                key={i}
                onClick={() => setSelectedWindow(i)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium capitalize",
                  selectedWindow === i
                    ? "bg-luxe-terracotta text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
                )}
              >
                {windowOptionLabel(granularity, i, year)}
              </button>
            ))}
          </div>
        )}

        <Button variant="outline" size="sm" onClick={onGoToToday}>
          <CalendarDays className="h-3.5 w-3.5" />
          Aller à aujourd'hui
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un circuit, une destination…"
            className="pl-8"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => toggleCategory(c)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                activeCategories.has(c)
                  ? "border-luxe-terracotta bg-luxe-terracotta text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
              )}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={compareYoY ? "default" : "outline"}
            size="sm"
            onClick={() => setCompareYoY(!compareYoY)}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Comparer N-1
          </Button>
          <Button
            variant={riskModeOn ? "destructive" : "outline"}
            size="sm"
            onClick={() => setRiskModeOn(!riskModeOn)}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Départs à risque {atRiskCount > 0 && `(${atRiskCount})`}
          </Button>
          <div className="flex items-center gap-1 rounded-lg bg-stone-100 p-1 dark:bg-stone-800">
            <button
              onClick={() => setViewMode("detailed")}
              title="Vue détaillée"
              className={cn("rounded-md p-1.5", viewMode === "detailed" ? "bg-white shadow-sm dark:bg-stone-900" : "text-stone-400")}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("compact")}
              title="Vue compacte"
              className={cn("rounded-md p-1.5", viewMode === "compact" ? "bg-white shadow-sm dark:bg-stone-900" : "text-stone-400")}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
