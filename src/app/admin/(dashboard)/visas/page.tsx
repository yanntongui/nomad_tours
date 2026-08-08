"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
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
import { useVisasStore } from "@/lib/admin/store/visas-store";
import { VISA_COUNTRIES } from "@/lib/admin/mock/visas";
import { VisaRequest, VisaStatus } from "@/lib/admin/types";

function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_LABELS: Record<VisaStatus, string> = {
  SUBMITTED: "Soumis",
  PROCESSING: "En traitement",
  APPROVED: "Approuvé",
  REJECTED: "Rejeté",
};

function VisasContent() {
  const router = useRouter();
  const store = useVisasStore();
  const [search, setSearch] = React.useState("");
  const [country, setCountry] = React.useState("ALL");
  const [status, setStatus] = React.useState("ALL");

  const filtered = React.useMemo(() => {
    return store.requests.filter((v) => {
      if (search && !v.client.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (country !== "ALL" && v.country !== country) return false;
      if (status !== "ALL" && v.status !== status) return false;
      return true;
    });
  }, [store.requests, search, country, status]);

  const columns = React.useMemo<ColumnDef<VisaRequest, any>[]>(
    () => [
      {
        id: "client",
        header: "Client",
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.client.name}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500">{row.original.client.email}</p>
          </div>
        ),
      },
      { accessorKey: "country", header: "Pays" },
      {
        id: "status",
        header: "Statut",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "feeXOF",
        header: "Frais",
        cell: ({ row }) => <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">{formatXOF(row.original.feeXOF)}</span>,
      },
      { accessorKey: "agent", header: "Agent" },
      {
        id: "submittedAt",
        header: "Soumis le",
        cell: ({ row }) => <span className="text-sm text-stone-500 dark:text-stone-400">{formatDate(row.original.submittedAt)}</span>,
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Demandes de Visa</h1>
        <p className="text-sm text-stone-500 mt-0.5 dark:text-stone-400">{filtered.length} résultat{filtered.length > 1 ? "s" : ""} sur {store.requests.length}</p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-3 flex flex-wrap items-center gap-2 dark:border-stone-800 dark:bg-stone-900">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          <Input placeholder="Nom du client..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Pays" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les pays</SelectItem>
            {VISA_COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            {(Object.keys(STATUS_LABELS) as VisaStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || country !== "ALL" || status !== "ALL") && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setCountry("ALL"); setStatus("ALL"); }}>
            <X className="h-3.5 w-3.5" />
            Réinitialiser
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(v) => v.id}
        onRowClick={(v) => router.push(`/admin/visas/${v.id}`)}
        emptyMessage="Aucune demande de visa ne correspond aux filtres."
      />
    </div>
  );
}

export default function VisasPage() {
  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <VisasContent />
    </RequireRole>
  );
}
