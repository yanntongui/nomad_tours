"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
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
import type { EventListRow } from "@/lib/server/events";
import type { Tables } from "@/lib/server/types";

type EventStatus = Tables<"event_requests">["status"];

const EVENT_TYPES = ["Mariage", "Séminaire d'entreprise", "Team Building", "Anniversaire", "Baptême", "Conférence"];

function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_LABELS: Record<EventStatus, string> = {
  DRAFT: "Brouillon",
  REQUESTED: "Demandé",
  QUOTED: "Devis envoyé",
  CONFIRMED: "Confirmé",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

export function EvenementielClient({ requests }: { requests: EventListRow[] }) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("ALL");
  const [status, setStatus] = React.useState("ALL");

  const filtered = React.useMemo(() => {
    return requests.filter((e) => {
      if (search && !(e.clients?.name ?? "").toLowerCase().includes(search.toLowerCase())) return false;
      if (type !== "ALL" && e.type !== type) return false;
      if (status !== "ALL" && e.status !== status) return false;
      return true;
    });
  }, [requests, search, type, status]);

  const columns = React.useMemo<ColumnDef<EventListRow, any>[]>(
    () => [
      {
        id: "client",
        header: "Client",
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.clients?.name ?? "—"}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500">{row.original.location ?? "—"}</p>
          </div>
        ),
      },
      { accessorKey: "type", header: "Type" },
      {
        id: "guest_count",
        header: "Invités",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.guest_count}</span>,
      },
      {
        id: "budget_xof",
        header: "Budget",
        cell: ({ row }) => <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">{formatXOF(row.original.budget_xof)}</span>,
      },
      {
        id: "status",
        header: "Statut",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "event_date",
        header: "Date de l'événement",
        cell: ({ row }) => <span className="text-sm text-stone-500 dark:text-stone-400">{formatDate(row.original.event_date)}</span>,
      },
      {
        id: "agent",
        header: "Agent",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.admin_profiles?.name ?? "—"}</span>,
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Événementiel</h1>
        <p className="text-sm text-stone-500 mt-0.5 dark:text-stone-400">{filtered.length} résultat{filtered.length > 1 ? "s" : ""} sur {requests.length}</p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-3 flex flex-wrap items-center gap-2 dark:border-stone-800 dark:bg-stone-900">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          <Input placeholder="Nom du client..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-52"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les types</SelectItem>
            {EVENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            {(Object.keys(STATUS_LABELS) as EventStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || type !== "ALL" || status !== "ALL") && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setType("ALL"); setStatus("ALL"); }}>
            <X className="h-3.5 w-3.5" />
            Réinitialiser
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(e) => e.id}
        onRowClick={(e) => router.push(`/admin/evenementiel/${e.id}`)}
        emptyMessage="Aucune demande événementielle ne correspond aux filtres."
      />
    </div>
  );
}
