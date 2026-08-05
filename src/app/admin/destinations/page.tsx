"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search, X, Star } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useDestinations, duplicateDestination } from "@/lib/admin/store/destinations-store";
import { Destination } from "@/lib/admin/types";

export default function DestinationsPage() {
  const router = useRouter();
  const destinations = useDestinations();
  const [search, setSearch] = React.useState("");
  const [scope, setScope] = React.useState<string>("ALL");

  const filtered = React.useMemo(() => {
    return destinations.filter((d) => {
      if (search) {
        const q = search.toLowerCase();
        if (!d.name.toLowerCase().includes(q) && !d.country.toLowerCase().includes(q)) return false;
      }
      if (scope === "INTL" && !d.isInternational) return false;
      if (scope === "LOCAL" && d.isInternational) return false;
      if (scope === "FEATURED" && !d.isFeatured) return false;
      return true;
    });
  }, [destinations, search, scope]);

  const columns = React.useMemo<ColumnDef<Destination, any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Destination",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.name}</p>
            {row.original.isFeatured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
          </div>
        ),
      },
      { accessorKey: "country", header: "Pays" },
      {
        accessorKey: "isInternational",
        header: "Portée",
        cell: ({ row }) => <Badge variant={row.original.isInternational ? "blue" : "emerald"}>{row.original.isInternational ? "International" : "Local"}</Badge>,
      },
      {
        accessorKey: "circuitsCount",
        header: "Circuits",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.circuitsCount}</span>,
      },
      {
        accessorKey: "pointsOfInterest",
        header: "Points d'intérêt",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.pointsOfInterest.length}</span>,
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
              <DropdownMenuItem onSelect={() => router.push(`/admin/destinations/${row.original.id}`)}>Modifier</DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  const copy = duplicateDestination(row.original.id);
                  if (copy) router.push(`/admin/destinations/${copy.id}`);
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
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Destinations</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{filtered.length} résultat{filtered.length > 1 ? "s" : ""} sur {destinations.length}</p>
        </div>
        <Button asChild>
          <Link href="/admin/destinations/new">
            <Plus className="h-4 w-4" />
            Nouvelle destination
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          <Input placeholder="Nom, pays..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={scope} onValueChange={setScope}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Portée" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes</SelectItem>
            <SelectItem value="INTL">International</SelectItem>
            <SelectItem value="LOCAL">Local</SelectItem>
            <SelectItem value="FEATURED">Mises en avant</SelectItem>
          </SelectContent>
        </Select>
        {(search || scope !== "ALL") && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setScope("ALL"); }}>
            <X className="h-3.5 w-3.5" />
            Réinitialiser
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(d) => d.id}
        onRowClick={(d) => router.push(`/admin/destinations/${d.id}`)}
        emptyMessage="Aucune destination ne correspond aux filtres."
      />
    </div>
  );
}
