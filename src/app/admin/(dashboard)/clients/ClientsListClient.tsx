"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tables } from "@/lib/server/types";
import type { listBookingStats } from "@/lib/server/bookings";

export type ClientRow = Tables<"clients">;
type BookingStats = Awaited<ReturnType<typeof listBookingStats>>;

function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

export function ClientsListClient({ clients, bookingStats }: { clients: ClientRow[]; bookingStats: BookingStats }) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [tag, setTag] = React.useState("ALL");

  const allTags = React.useMemo(
    () => Array.from(new Set(clients.flatMap((c) => c.tags))).sort(),
    [clients]
  );

  const stats = React.useMemo(() => {
    const map = new Map<string, { count: number; lifetimeValue: number }>();
    bookingStats.forEach((b) => {
      const entry = map.get(b.client_id) ?? { count: 0, lifetimeValue: 0 };
      entry.count += 1;
      entry.lifetimeValue += b.paid_xof;
      map.set(b.client_id, entry);
    });
    return map;
  }, [bookingStats]);

  const filtered = React.useMemo(() => {
    return clients.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (tag !== "ALL" && !c.tags.includes(tag)) return false;
      return true;
    });
  }, [clients, search, tag]);

  const columns = React.useMemo<ColumnDef<ClientRow, any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Client",
        cell: ({ row }) => <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.name}</p>,
      },
      {
        id: "contact",
        header: "Contact",
        cell: ({ row }) => (
          <div>
            <p className="text-sm text-stone-600 dark:text-stone-400">{row.original.email}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500">{row.original.phone}</p>
          </div>
        ),
      },
      {
        id: "tags",
        header: "Tags",
        cell: ({ row }) =>
          row.original.tags.length === 0 ? (
            <span className="text-xs text-stone-400 dark:text-stone-500">—</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {row.original.tags.map((t) => (
                <Badge key={t} variant="default">{t}</Badge>
              ))}
            </div>
          ),
      },
      {
        id: "bookingsCount",
        header: "Réservations",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{stats.get(row.original.id)?.count ?? 0}</span>,
      },
      {
        id: "lifetimeValue",
        header: "Valeur cumulée",
        cell: ({ row }) => <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">{formatXOF(stats.get(row.original.id)?.lifetimeValue ?? 0)}</span>,
      },
    ],
    [stats]
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Clients</h1>
        <p className="text-sm text-stone-500 mt-0.5 dark:text-stone-400">{filtered.length} résultat{filtered.length > 1 ? "s" : ""} sur {clients.length}</p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-3 flex flex-wrap items-center gap-2 dark:border-stone-800 dark:bg-stone-900">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          <Input placeholder="Nom ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={tag} onValueChange={setTag}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Tag" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les tags</SelectItem>
            {allTags.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || tag !== "ALL") && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setTag("ALL"); }}>
            <X className="h-3.5 w-3.5" />
            Réinitialiser
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(c) => c.id}
        onRowClick={(c) => router.push(`/admin/clients/${c.id}`)}
        emptyMessage="Aucun client ne correspond aux filtres."
      />
    </div>
  );
}
