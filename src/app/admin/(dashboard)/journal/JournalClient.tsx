"use client";
import * as React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Search, X, FileClock } from "lucide-react";
import { DataTable, exportRowsToCsv } from "@/components/admin/DataTable";
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
import { AuditLogEntry, AUDIT_SOURCE_LABELS } from "@/lib/admin/audit-log-types";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function JournalClient({ entries }: { entries: AuditLogEntry[] }) {
  const [search, setSearch] = React.useState("");
  const [source, setSource] = React.useState("ALL");
  const [actor, setActor] = React.useState("ALL");
  const [date, setDate] = React.useState("");

  const actors = React.useMemo(() => Array.from(new Set(entries.map((e) => e.actor))).sort(), [entries]);

  const filtered = React.useMemo(() => {
    return entries.filter((e) => {
      const matchesSearch =
        !search ||
        e.label.toLowerCase().includes(search.toLowerCase()) ||
        e.entityLabel.toLowerCase().includes(search.toLowerCase()) ||
        (e.detail ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesSource = source === "ALL" || e.source === source;
      const matchesActor = actor === "ALL" || e.actor === actor;
      const matchesDate = !date || e.createdAt.slice(0, 10) === date;
      return matchesSearch && matchesSource && matchesActor && matchesDate;
    });
  }, [entries, search, source, actor, date]);

  const resetFilters = () => {
    setSearch("");
    setSource("ALL");
    setActor("ALL");
    setDate("");
  };

  const columns = React.useMemo<ColumnDef<AuditLogEntry, any>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => <span className="whitespace-nowrap text-xs text-stone-500 dark:text-stone-400">{formatDateTime(row.original.createdAt)}</span>,
      },
      {
        accessorKey: "source",
        header: "Type",
        cell: ({ row }) => <StatusBadge status={row.original.source} />,
      },
      {
        accessorKey: "entityLabel",
        header: "Entité",
        cell: ({ row }) => (
          <Link href={row.original.href} className="text-sm font-medium text-luxe-terracotta hover:underline" onClick={(e) => e.stopPropagation()}>
            {row.original.entityLabel}
          </Link>
        ),
      },
      {
        accessorKey: "label",
        header: "Action",
        cell: ({ row }) => (
          <div>
            <p className="text-sm text-stone-800 dark:text-stone-100">{row.original.label}</p>
            {row.original.detail && <p className="text-xs text-stone-400">{row.original.detail}</p>}
          </div>
        ),
      },
      {
        accessorKey: "actor",
        header: "Acteur",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-300">{row.original.actor}</span>,
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-stone-800 dark:text-stone-100">Journal d&apos;audit</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">{filtered.length} événement{filtered.length > 1 ? "s" : ""} sur {entries.length}</p>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            exportRowsToCsv(
              filtered.map((e) => ({ ...e, sourceLabel: AUDIT_SOURCE_LABELS[e.source] })),
              [
                { key: "createdAt", label: "Date" },
                { key: "sourceLabel", label: "Type" },
                { key: "entityLabel", label: "Entité" },
                { key: "label", label: "Action" },
                { key: "detail", label: "Détail" },
                { key: "actor", label: "Acteur" },
              ],
              "journal-audit"
            )
          }
        >
          Exporter CSV
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          <Input placeholder="Action, entité, détail..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous types</SelectItem>
            {Object.entries(AUDIT_SOURCE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={actor} onValueChange={setActor}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Acteur" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous acteurs</SelectItem>
            {actors.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" />
        {(search || source !== "ALL" || actor !== "ALL" || date) && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1 text-stone-500">
            <X className="h-3.5 w-3.5" /> Réinitialiser
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white py-24 text-center px-6 dark:border-stone-700 dark:bg-stone-900">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400 mb-4 dark:bg-stone-800">
            <FileClock className="h-7 w-7" />
          </span>
          <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">Aucune activité</h2>
          <p className="mt-2 max-w-md text-sm text-stone-500 dark:text-stone-400">Les actions effectuées sur les réservations, visas, événements, tickets et voyages apparaîtront ici.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} getRowId={(e) => e.id} pageSize={20} emptyMessage="Aucun résultat pour ces filtres." storageKey="admin-journal" />
      )}
    </div>
  );
}
