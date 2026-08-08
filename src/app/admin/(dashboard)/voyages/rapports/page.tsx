"use client";
import * as React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Search, X, FileBarChart2 } from "lucide-react";
import { DataTable, exportRowsToCsv } from "@/components/admin/DataTable";
import { RequireRole } from "@/components/admin/RequireRole";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTrips, useTripReports, getFeedbackAggregation } from "@/lib/admin/store/trips-store";
import { Trip, TripReport, TripReportStatus } from "@/lib/admin/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_LABELS: Record<TripReportStatus, string> = { DRAFT: "Brouillon", FINALIZED: "Finalisé" };

interface Row {
  report: TripReport;
  trip: Trip;
  avgRating: string;
}

function RapportsContent() {
  const reports = useTripReports();
  const trips = useTrips();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("ALL");
  const [date, setDate] = React.useState("");

  const rows = React.useMemo<Row[]>(() => {
    return reports
      .map((report) => {
        const trip = trips.find((t) => t.id === report.tripId);
        if (!trip) return null;
        const agg = getFeedbackAggregation(trip);
        return { report, trip, avgRating: agg.feedbacks.length > 0 ? agg.avg.toFixed(1) : "—" };
      })
      .filter((r): r is Row => r !== null);
  }, [reports, trips]);

  const filtered = React.useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch = !search || r.trip.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "ALL" || r.report.status === status;
      const matchesDate = !date || r.report.generatedAt.slice(0, 10) === date;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [rows, search, status, date]);

  const resetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setDate("");
  };

  const columns = React.useMemo<ColumnDef<Row, any>[]>(
    () => [
      {
        accessorKey: "report.generatedAt",
        header: "Généré le",
        cell: ({ row }) => <span className="whitespace-nowrap text-xs text-stone-500 dark:text-stone-400">{formatDate(row.original.report.generatedAt)}</span>,
      },
      {
        accessorKey: "trip.title",
        header: "Circuit",
        cell: ({ row }) => (
          <Link
            href={`/admin/voyages/${row.original.trip.id}/rapport`}
            className="text-sm font-medium text-luxe-terracotta hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.trip.title}
          </Link>
        ),
      },
      {
        accessorKey: "report.status",
        header: "Statut",
        cell: ({ row }) => <StatusBadge status={row.original.report.status} label={STATUS_LABELS[row.original.report.status]} />,
      },
      {
        accessorKey: "report.manual.redacteur",
        header: "Rédacteur",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-300">{row.original.report.manual.redacteur ?? "—"}</span>,
      },
      {
        accessorKey: "avgRating",
        header: "Note moyenne",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-300">{row.original.avgRating}</span>,
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-stone-800 dark:text-stone-100">Rapports de voyage</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">{filtered.length} rapport{filtered.length > 1 ? "s" : ""} sur {rows.length}</p>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            exportRowsToCsv(
              filtered.map((r) => ({
                generatedAt: formatDate(r.report.generatedAt),
                circuit: r.trip.title,
                statut: STATUS_LABELS[r.report.status],
                redacteur: r.report.manual.redacteur ?? "",
                noteMoyenne: r.avgRating,
              })),
              [
                { key: "generatedAt", label: "Généré le" },
                { key: "circuit", label: "Circuit" },
                { key: "statut", label: "Statut" },
                { key: "redacteur", label: "Rédacteur" },
                { key: "noteMoyenne", label: "Note moyenne" },
              ],
              "rapports-voyage"
            )
          }
        >
          Exporter CSV
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          <Input placeholder="Nom du circuit..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous statuts</SelectItem>
            <SelectItem value="DRAFT">Brouillon</SelectItem>
            <SelectItem value="FINALIZED">Finalisé</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" />
        {(search || status !== "ALL" || date) && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1 text-stone-500">
            <X className="h-3.5 w-3.5" /> Réinitialiser
          </Button>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white py-24 text-center px-6 dark:border-stone-700 dark:bg-stone-900">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400 mb-4 dark:bg-stone-800">
            <FileBarChart2 className="h-7 w-7" />
          </span>
          <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">Aucun rapport</h2>
          <p className="mt-2 max-w-md text-sm text-stone-500 dark:text-stone-400">Les rapports de voyage apparaissent ici dès qu&apos;un voyage est clôturé.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          getRowId={(r) => r.report.id}
          pageSize={20}
          emptyMessage="Aucun résultat pour ces filtres."
          storageKey="admin-voyages-rapports"
        />
      )}
    </div>
  );
}

export default function RapportsPage() {
  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <RapportsContent />
    </RequireRole>
  );
}
