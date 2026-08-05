"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search, X, Star } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCircuits, duplicateCircuit } from "@/lib/admin/store/circuits-store";
import { useDestinations } from "@/lib/admin/store/destinations-store";
import { Circuit } from "@/lib/admin/types";

function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

const THEMES = ["Culture", "Safari", "Plage", "Aventure", "Événement"] as const;

export default function CircuitsPage() {
  const router = useRouter();
  const circuits = useCircuits();
  const destinations = useDestinations();
  const [search, setSearch] = React.useState("");
  const [destinationId, setDestinationId] = React.useState("ALL");
  const [theme, setTheme] = React.useState("ALL");

  const filtered = React.useMemo(() => {
    return circuits.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (destinationId !== "ALL" && c.destinationId !== destinationId) return false;
      if (theme !== "ALL" && c.theme !== theme) return false;
      return true;
    });
  }, [circuits, search, destinationId, theme]);

  const columns = React.useMemo<ColumnDef<Circuit, any>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Circuit",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.title}</p>
            {row.original.isFeatured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
          </div>
        ),
      },
      { accessorKey: "destinationName", header: "Destination" },
      {
        accessorKey: "theme",
        header: "Thème",
        cell: ({ row }) => <StatusBadge status={row.original.theme} label={row.original.theme} />,
      },
      {
        accessorKey: "durationDays",
        header: "Durée",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.durationDays} j</span>,
      },
      {
        accessorKey: "priceXOF",
        header: "Prix",
        cell: ({ row }) => <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">{formatXOF(row.original.priceXOF)}</span>,
      },
      {
        accessorKey: "departures",
        header: "Départs",
        cell: ({ row }) => {
          const open = row.original.departures.filter((d) => d.status === "OPEN").length;
          return <span className="text-sm text-stone-600 dark:text-stone-400">{open} ouvert{open > 1 ? "s" : ""} / {row.original.departures.length}</span>;
        },
      },
      {
        accessorKey: "bookingsCount",
        header: "Réservations",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.bookingsCount}</span>,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onSelect={() => router.push(`/admin/circuits/${row.original.id}`)}>Modifier</DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  const copy = duplicateCircuit(row.original.id);
                  if (copy) router.push(`/admin/circuits/${copy.id}`);
                }}
              >
                Dupliquer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [router]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Circuits</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{filtered.length} résultat{filtered.length > 1 ? "s" : ""} sur {circuits.length}</p>
        </div>
        <Button asChild>
          <Link href="/admin/circuits/new">
            <Plus className="h-4 w-4" />
            Nouveau circuit
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          <Input placeholder="Titre du circuit..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={destinationId} onValueChange={setDestinationId}>
          <SelectTrigger className="w-52"><SelectValue placeholder="Destination" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes destinations</SelectItem>
            {destinations.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Thème" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous thèmes</SelectItem>
            {THEMES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || destinationId !== "ALL" || theme !== "ALL") && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setDestinationId("ALL"); setTheme("ALL"); }}>
            <X className="h-3.5 w-3.5" />
            Réinitialiser
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(c) => c.id}
        onRowClick={(c) => router.push(`/admin/circuits/${c.id}`)}
        emptyMessage="Aucun circuit ne correspond aux filtres."
      />
    </div>
  );
}
