"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search, X, Star, Upload } from "lucide-react";
import { DataTable, exportRowsToCsv } from "@/components/admin/DataTable";
import { parseCsv } from "@/lib/admin/csv-import";
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
import type { DestinationRow } from "@/lib/server/destinations";
import { duplicateDestinationAction, importDestinationsAction } from "./actions";

const CSV_HEADERS: { key: keyof DestinationRow; label: string }[] = [
  { key: "name", label: "Nom" },
  { key: "country", label: "Pays" },
  { key: "region", label: "Région" },
  { key: "is_international", label: "International" },
  { key: "is_featured", label: "Mise en avant" },
  { key: "climate", label: "Climat" },
  { key: "best_period", label: "Meilleure période" },
];

interface DestinationsListClientProps {
  destinations: DestinationRow[];
  circuitCounts: Record<string, number>;
}

export function DestinationsListClient({ destinations, circuitCounts }: DestinationsListClientProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [scope, setScope] = React.useState<string>("ALL");
  const [importMessage, setImportMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(async (text) => {
      const rows = parseCsv(text);
      const payload = rows
        .filter((row) => row.Nom || row.name)
        .map((row) => ({
          name: row.Nom ?? row.name ?? "",
          country: row.Pays ?? row.country ?? "",
          region: row["Région"] ?? row.region ?? "",
          is_international: /^(true|oui|1)$/i.test(row.International ?? row.isInternational ?? ""),
          is_featured: /^(true|oui|1)$/i.test(row["Mise en avant"] ?? row.isFeatured ?? ""),
          climate: row.Climat ?? row.climate ?? "",
          best_period: row["Meilleure période"] ?? row.bestPeriod ?? "",
        }));
      const result = await importDestinationsAction(payload);
      setImportMessage(`${result.count} destination(s) importée(s).`);
      router.refresh();
    });
    e.target.value = "";
  }

  async function handleDuplicate(id: string) {
    setError(null);
    const result = await duplicateDestinationAction(id);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.data) router.push(`/admin/destinations/${result.data.id}`);
  }

  const filtered = React.useMemo(() => {
    return destinations.filter((d) => {
      if (search) {
        const q = search.toLowerCase();
        if (!d.name.toLowerCase().includes(q) && !d.country.toLowerCase().includes(q)) return false;
      }
      if (scope === "INTL" && !d.is_international) return false;
      if (scope === "LOCAL" && d.is_international) return false;
      if (scope === "FEATURED" && !d.is_featured) return false;
      return true;
    });
  }, [destinations, search, scope]);

  const columns = React.useMemo<ColumnDef<DestinationRow, any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Destination",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.name}</p>
            {row.original.is_featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
          </div>
        ),
      },
      { accessorKey: "country", header: "Pays" },
      {
        accessorKey: "is_international",
        header: "Portée",
        cell: ({ row }) => (
          <Badge variant={row.original.is_international ? "blue" : "emerald"}>
            {row.original.is_international ? "International" : "Local"}
          </Badge>
        ),
      },
      {
        id: "circuitsCount",
        header: "Circuits",
        cell: ({ row }) => (
          <span className="text-sm text-stone-600 dark:text-stone-400">{circuitCounts[row.original.id] ?? 0}</span>
        ),
      },
      {
        accessorKey: "destination_points_of_interest",
        header: "Points d'intérêt",
        cell: ({ row }) => (
          <span className="text-sm text-stone-600 dark:text-stone-400">
            {row.original.destination_points_of_interest.length}
          </span>
        ),
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
              <DropdownMenuItem onSelect={() => handleDuplicate(row.original.id)}>Dupliquer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [router, circuitCounts]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Destinations</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{filtered.length} résultat{filtered.length > 1 ? "s" : ""} sur {destinations.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            Importer
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImportFile} />
          <Button asChild>
            <Link href="/admin/destinations/new">
              <Plus className="h-4 w-4" />
              Nouvelle destination
            </Link>
          </Button>
        </div>
      </div>

      {importMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
          {importMessage}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

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
        onExportCsv={() => exportRowsToCsv(filtered, CSV_HEADERS, `destinations-${Date.now()}`)}
      />
    </div>
  );
}
