"use client";
import * as React from "react";
import { RequireRole } from "@/components/admin/RequireRole";
import { ProgrammeHeader } from "@/components/admin/programme/ProgrammeHeader";
import { YearProgressBar } from "@/components/admin/programme/YearProgressBar";
import { ProgrammeKpis } from "@/components/admin/programme/ProgrammeKpis";
import { DensityChart, buildDensityData } from "@/components/admin/programme/DensityChart";
import { ControlsBar } from "@/components/admin/programme/ControlsBar";
import { MonthCard } from "@/components/admin/programme/MonthCard";
import { CompactList } from "@/components/admin/programme/CompactList";
import { RiskModeView, RiskItem } from "@/components/admin/programme/RiskModeView";
import { exportProgrammeAsPdf, exportProgrammeAsPng } from "@/lib/admin/programme-export";
import { Circuit, CircuitCategory } from "@/lib/admin/types";
import {
  Granularity,
  bucketDeparturesByMonth,
  computeYearKpis,
  getAllDepartures,
  getPreviousYearComparison,
  getSalesOpeningRecommendations,
  getWindowMonths,
  getDaysUntil,
  isAtRisk,
} from "@/lib/admin/programme-annuel";

export interface ActiveTripInfo {
  id: string;
  circuitId: string;
  hasIncompleteChecklist: boolean;
  tasks: { category: string; status: string; dueDate: string }[];
}

export function ProgrammeAnnuelClient({ circuits, activeTrips }: { circuits: Circuit[]; activeTrips: ActiveTripInfo[] }) {
  const now = React.useMemo(() => new Date(), []);
  const year = now.getFullYear();

  const activeTripByCircuit = React.useMemo(
    () => new Map(activeTrips.map((t) => [t.circuitId, t])),
    [activeTrips]
  );

  const [granularity, setGranularity] = React.useState<Granularity>("ANNEE");
  const [selectedWindow, setSelectedWindow] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [activeCategories, setActiveCategories] = React.useState<Set<CircuitCategory>>(new Set());
  const [viewMode, setViewMode] = React.useState<"detailed" | "compact">("detailed");
  const [riskModeOn, setRiskModeOn] = React.useState(false);
  const [compareYoY, setCompareYoY] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);

  const contentRef = React.useRef<HTMLDivElement>(null);

  const allDepartures = React.useMemo(() => getAllDepartures(circuits), [circuits]);

  const filteredDepartures = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return allDepartures.filter((d) => {
      if (activeCategories.size > 0 && !activeCategories.has(d.circuit.category)) return false;
      if (q && !d.circuit.title.toLowerCase().includes(q) && !d.circuit.destinationName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allDepartures, activeCategories, search]);

  const kpis = React.useMemo(() => computeYearKpis(filteredDepartures, now, year), [filteredDepartures, now, year]);
  const buckets = React.useMemo(() => bucketDeparturesByMonth(filteredDepartures, year), [filteredDepartures, year]);
  const prevYearCounts = React.useMemo(() => getPreviousYearComparison(filteredDepartures, year), [filteredDepartures, year]);
  const windowMonths = React.useMemo(() => getWindowMonths(granularity, selectedWindow), [granularity, selectedWindow]);
  const densityData = React.useMemo(
    () => buildDensityData(buckets, prevYearCounts, now.getMonth(), windowMonths, year),
    [buckets, prevYearCounts, now, windowMonths, year]
  );
  const windowDepartures = React.useMemo(
    () =>
      filteredDepartures.filter((d) => {
        const dt = new Date(d.date);
        return dt.getFullYear() === year && windowMonths.includes(dt.getMonth());
      }),
    [filteredDepartures, windowMonths, year]
  );

  const riskItems: RiskItem[] = React.useMemo(() => {
    const items: RiskItem[] = [];
    for (const departure of filteredDepartures) {
      if (new Date(departure.date).getFullYear() !== year) continue;
      const reasons: string[] = [];
      if (isAtRisk(departure, now)) reasons.push("Remplissage faible");

      const trip = activeTripByCircuit.get(departure.circuit.id);
      if (trip) {
        const overdue = trip.tasks.some(
          (t) => (t.category === "FINANCE" || t.category === "DOCUMENTS_CLIENT") && t.status !== "FAIT" && new Date(t.dueDate) < now
        );
        if (overdue) reasons.push("Tâche en retard");

        const daysUntil = getDaysUntil(departure.date, now);
        const missingDocs = daysUntil >= 0 && daysUntil <= 30 && trip.hasIncompleteChecklist;
        if (missingDocs) reasons.push("Documents manquants");
      }

      if (reasons.length > 0) items.push({ departure, reasons });
    }
    return items;
  }, [filteredDepartures, now, year, activeTripByCircuit]);

  const recommendations = React.useMemo(() => getSalesOpeningRecommendations(allDepartures, now), [allDepartures, now]);

  function toggleCategory(c: CircuitCategory) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  function handleMonthClick(monthIndex: number) {
    setGranularity("MOIS");
    setSelectedWindow(monthIndex);
  }

  function handleGoToToday() {
    setGranularity("MOIS");
    setSelectedWindow(now.getMonth());
  }

  async function handleExportPng() {
    if (!contentRef.current) return;
    setExporting(true);
    try {
      await exportProgrammeAsPng(contentRef.current);
    } finally {
      setExporting(false);
    }
  }

  async function handleExportPdf() {
    if (!contentRef.current) return;
    setExporting(true);
    try {
      await exportProgrammeAsPdf(contentRef.current);
    } finally {
      setExporting(false);
    }
  }

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <div className="space-y-5">
        <ProgrammeHeader
          onExportPng={handleExportPng}
          onExportPdf={handleExportPdf}
          exporting={exporting}
          recommendations={recommendations}
          atRiskCount={riskItems.length}
          onViewRisk={() => setRiskModeOn(true)}
        />

        <ControlsBar
          year={year}
          granularity={granularity}
          setGranularity={setGranularity}
          selectedWindow={selectedWindow}
          setSelectedWindow={setSelectedWindow}
          search={search}
          setSearch={setSearch}
          activeCategories={activeCategories}
          toggleCategory={toggleCategory}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onGoToToday={handleGoToToday}
          compareYoY={compareYoY}
          setCompareYoY={setCompareYoY}
          riskModeOn={riskModeOn}
          setRiskModeOn={setRiskModeOn}
          atRiskCount={riskItems.length}
        />

        <div ref={contentRef} className="space-y-5">
          <YearProgressBar now={now} year={year} />
          <ProgrammeKpis kpis={kpis} />
          <DensityChart
            data={densityData}
            currentMonth={now.getMonth()}
            compareYoY={compareYoY}
            onMonthClick={handleMonthClick}
          />

          {riskModeOn ? (
            <RiskModeView items={riskItems} now={now} />
          ) : viewMode === "compact" ? (
            <CompactList departures={windowDepartures} now={now} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {windowMonths.map((m) => (
                <MonthCard
                  key={m}
                  month={m}
                  year={year}
                  departures={buckets.get(m) ?? []}
                  now={now}
                  activeTripByCircuit={activeTripByCircuit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </RequireRole>
  );
}
