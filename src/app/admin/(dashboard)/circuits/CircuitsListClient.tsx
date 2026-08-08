"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search, X, Star, Upload } from "lucide-react";
import { DataTable, exportRowsToCsv } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { parseCsv } from "@/lib/admin/csv-import";
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
import type { CircuitRow } from "@/lib/server/circuits";
import type { DestinationRow } from "@/lib/server/destinations";
import type { Enums } from "@/lib/server/types";
import { duplicateCircuitAction, importCircuitsAction } from "./actions";

function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

const THEMES = ["Culture", "Safari", "Plage", "Aventure", "Événement"] as const;

const CSV_HEADERS: { key: keyof CircuitRow; label: string }[] = [
  { key: "title", label: "Titre" },
  { key: "theme", label: "Thème" },
  { key: "duration_days", label: "Durée (jours)" },
  { key: "price_xof", label: "Prix (FCFA)" },
  { key: "is_featured", label: "Mise en avant" },
];

interface CircuitsListClientProps {
  circuits: CircuitRow[];
  destinations: DestinationRow[];
}

export function CircuitsListClient({ circuits, destinations }: CircuitsListClientProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [destinationId, setDestinationId] = React.useState("ALL");
  const [theme, setTheme] = React.useState("ALL");
  const [importMessage, setImportMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const destinationNames = React.useMemo(() => {
    const map: Record<string, string> = {};
    for (const d of destinations) map[d.id] = d.name;
    return map;
  }, [destinations]);

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(async (text) => {
      const rows = parseCsv(text);
      const payload = rows
        .filter((row) => row.Titre || row.title)
        .map((row) => {
          const destName = row.Destination ?? row.destinationName ?? "";
          const dest = destinations.find((d) => d.name.toLowerCase() === destName.toLowerCase());
          return {
            title: row.Titre ?? row.title ?? "",
            destination_id: dest?.id ?? destinations[0]?.id ?? "",
            theme: (THEMES as readonly string[]).includes(row["Thème"] ?? row.theme ?? "")
              ? (row["Thème"] ?? row.theme ?? "Culture")
              : "Culture",
            category: "ESCAPADE_LOCALE" as Enums<"circuit_category">,
            duration_days: Number(row["Durée (jours)"] ?? row.durationDays ?? 1) || 1,
            price_xof: Number(row["Prix (FCFA)"] ?? row.priceXOF ?? 0) || 0,
            is_featured: /^(true|oui|1)$/i.test(row["Mise en avant"] ?? row.isFeatured ?? ""),
          };
        })
        .filter((row) => row.destination_id);
      const result = await importCircuitsAction(payload);
      setImportMessage(`${result.count} circuit(s) importé(s).`);
      router.refresh();
    });
    e.target.value = "";
  }

  async function handleDuplicate(id: string) {
    setError(null);
    const result = await duplicateCircuitAction(id);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.data) router.push(`/admin/circuits/${result.data.id}`);
  }

  const filtered = React.useMemo(() => {
    return circuits.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (destinationId !== "ALL" && c.destination_id !== destinationId) return false;
      if (theme !== "ALL" && c.theme !== theme) return false;
      return true;
    });
  }, [circuits, search, destinationId, theme]);

  const columns = React.useMemo<ColumnDef<CircuitRow, any>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Circuit",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.title}</p>
            {row.original.is_featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
          </div>
        ),
      },
      {
        id: "destination",
        header: "Destination",
        cell: ({ row }) => (
          <span className="text-sm text-stone-600 dark:text-stone-400">
            {destinationNames[row.original.destination_id] ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "theme",
        header: "Thème",
        cell: ({ row }) => <StatusBadge status={row.original.theme} label={row.original.theme} />,
      },
      {
        accessorKey: "duration_days",
        header: "Durée",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.duration_days} j</span>,
      },
      {
        accessorKey: "price_xof",
        header: "Prix",
        cell: ({ row }) => <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">{formatXOF(row.original.price_xof)}</span>,
      },
      {
        id: "departures",
        header: "Départs",
        cell: ({ row }) => {
          const deps = row.original.circuit_departures;
          const open = deps.filter((d) => d.status === "OPEN").length;
          return <span className="text-sm text-stone-600 dark:text-stone-400">{open} ouvert{open > 1 ? "s" : ""} / {deps.length}</span>;
        },
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
              <DropdownMenuItem onSelect={() => handleDuplicate(row.original.id)}>Dupliquer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [router, destinationNames]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Circuits</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{filtered.length} résultat{filtered.length > 1 ? "s" : ""} sur {circuits.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            Importer
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImportFile} />
          <Button asChild>
            <Link href="/admin/circuits/new">
              <Plus className="h-4 w-4" />
              Nouveau circuit
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
        onExportCsv={() => exportRowsToCsv(filtered, CSV_HEADERS, `circuits-${Date.now()}`)}
      />
    </div>
  );
}
