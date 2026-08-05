"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search, X, Send, UserCog, Flag } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminRole } from "@/context/AdminRoleContext";
import { useBookingsStore, reassignBooking, toggleUrgent } from "@/lib/admin/store/bookings-store";
import { useAgents } from "@/lib/admin/store/users-store";
import { Booking } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

type QuickFilter = "ALL" | "LATE" | "URGENT" | "PENDING";

export default function ReservationsPage() {
  const router = useRouter();
  const { user } = useAdminRole();
  const store = useBookingsStore();
  const agents = useAgents();
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState<string>("ALL");
  const [status, setStatus] = React.useState<string>("ALL");
  const [paymentStatus, setPaymentStatus] = React.useState<string>("ALL");
  const [agent, setAgent] = React.useState<string>("ALL");
  const [quickFilter, setQuickFilter] = React.useState<QuickFilter>("ALL");
  const [selectedRows, setSelectedRows] = React.useState<Booking[]>([]);

  const lateBookingIds = React.useMemo(
    () => new Set(store.schedules.filter((s) => s.status === "LATE").map((s) => s.bookingId)),
    [store.schedules]
  );

  const filtered = React.useMemo(() => {
    return store.bookings.filter((b) => {
      if (search) {
        const q = search.toLowerCase();
        const matches =
          b.bookingNumber.toLowerCase().includes(q) ||
          b.client.name.toLowerCase().includes(q) ||
          b.referenceLabel.toLowerCase().includes(q) ||
          b.destinationName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (type !== "ALL" && b.type !== type) return false;
      if (status !== "ALL" && b.status !== status) return false;
      if (paymentStatus !== "ALL" && b.paymentStatus !== paymentStatus) return false;
      if (agent !== "ALL" && b.agent !== agent) return false;
      if (quickFilter === "LATE" && !lateBookingIds.has(b.id)) return false;
      if (quickFilter === "URGENT" && !b.urgent) return false;
      if (quickFilter === "PENDING" && b.status !== "PENDING") return false;
      return true;
    });
  }, [store.bookings, search, type, status, paymentStatus, agent, quickFilter, lateBookingIds]);

  const resetFilters = () => {
    setSearch("");
    setType("ALL");
    setStatus("ALL");
    setPaymentStatus("ALL");
    setAgent("ALL");
    setQuickFilter("ALL");
  };

  const csvHeaders: { key: keyof Booking; label: string }[] = [
    { key: "bookingNumber", label: "Réf." },
    { key: "referenceLabel", label: "Prestation" },
    { key: "destinationName", label: "Destination" },
    { key: "type", label: "Type" },
    { key: "totalPriceXOF", label: "Montant (FCFA)" },
    { key: "paidXOF", label: "Payé (FCFA)" },
    { key: "status", label: "Statut" },
    { key: "paymentStatus", label: "Statut paiement" },
    { key: "agent", label: "Agent" },
    { key: "departDate", label: "Date de départ" },
  ];

  const columns = React.useMemo<ColumnDef<Booking, any>[]>(
    () => [
      {
        accessorKey: "bookingNumber",
        header: "Réf.",
        cell: ({ row }) => <span className="font-mono text-xs font-semibold text-stone-700 dark:text-stone-300">{row.original.bookingNumber}</span>,
      },
      {
        id: "client",
        accessorFn: (b) => b.client.name,
        header: "Client",
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.client.name}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500">{row.original.client.phone}</p>
          </div>
        ),
      },
      {
        accessorKey: "referenceLabel",
        header: "Prestation",
        cell: ({ row }) => (
          <div className="max-w-[220px]">
            <p className="text-sm text-stone-700 dark:text-stone-300 truncate">{row.original.referenceLabel}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500">{row.original.destinationName}</p>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => <StatusBadge status={row.original.type} label={{ CIRCUIT: "Circuit", FLIGHT: "Vol", EVENT: "Événement" }[row.original.type]} />,
      },
      {
        accessorKey: "totalPriceXOF",
        header: "Montant",
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">{formatXOF(row.original.totalPriceXOF)}</p>
            {row.original.paymentStatus === "PARTIAL" && (
              <p className="text-[11px] text-amber-600">{formatXOF(row.original.paidXOF)} payé</p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "paymentStatus",
        header: "Paiement",
        cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} />,
      },
      {
        accessorKey: "departDate",
        header: "Départ",
        cell: ({ row }) => (
          <span className="text-sm text-stone-600 dark:text-stone-400">
            {formatDate(row.original.departDate)}
            {row.original.urgent && <Flag className="inline-block h-3 w-3 text-red-500 ml-1 -mt-0.5" />}
          </span>
        ),
      },
      { accessorKey: "agent", header: "Agent", cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.agent}</span> },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onSelect={() => router.push(`/admin/reservations/${row.original.id}`)}>Voir le détail</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toggleUrgent(row.original.id, user.name)}>
                {row.original.urgent ? "Retirer l'urgence" : "Marquer urgent"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Réassigner</DropdownMenuLabel>
              {agents.map((a) => (
                <DropdownMenuItem key={a.id} onSelect={() => reassignBooking(row.original.id, a.name, user.name)}>
                  {a.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [router, user.name]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Réservations</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{filtered.length} résultat{filtered.length > 1 ? "s" : ""} sur {store.bookings.length}</p>
        </div>
        <Button asChild>
          <Link href="/admin/reservations/new">
            <Plus className="h-4 w-4" />
            Nouvelle réservation
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {([
          ["ALL", "Toutes"],
          ["LATE", "Paiements en retard"],
          ["URGENT", "Urgentes"],
          ["PENDING", "En attente"],
        ] as [QuickFilter, string][]).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setQuickFilter(value)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors",
              quickFilter === value ? "bg-luxe-terracotta text-white border-luxe-terracotta" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 dark:bg-stone-900 dark:text-stone-400 dark:border-stone-800 dark:hover:border-stone-700"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-3 flex flex-wrap items-center gap-2 dark:border-stone-800 dark:bg-stone-900">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          <Input placeholder="Client, réf., destination..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous types</SelectItem>
            <SelectItem value="CIRCUIT">Circuit</SelectItem>
            <SelectItem value="FLIGHT">Vol</SelectItem>
            <SelectItem value="EVENT">Événement</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous statuts</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="CONFIRMED">Confirmée</SelectItem>
            <SelectItem value="CANCELLED">Annulée</SelectItem>
            <SelectItem value="COMPLETED">Terminée</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Paiement" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous paiements</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="PARTIAL">Partiel</SelectItem>
            <SelectItem value="PAID">Payé</SelectItem>
            <SelectItem value="FAILED">Échoué</SelectItem>
            <SelectItem value="REFUNDED">Remboursé</SelectItem>
          </SelectContent>
        </Select>
        <Select value={agent} onValueChange={setAgent}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Agent" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous agents</SelectItem>
            {agents.map((a) => (
              <SelectItem key={a.id} value={a.name}>{a.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <X className="h-3.5 w-3.5" />
          Réinitialiser
        </Button>
      </div>

      {selectedRows.length > 0 && (
        <div className="rounded-xl border border-luxe-terracotta/30 bg-luxe-terracotta/5 p-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-stone-700 dark:text-stone-300 mr-2">{selectedRows.length} sélectionné(s)</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportRowsToCsv(selectedRows, csvHeaders, `reservations-selection-${Date.now()}`)}
          >
            Exporter la sélection
          </Button>
          <Button variant="outline" size="sm" onClick={() => selectedRows.forEach((b) => toggleUrgent(b.id, user.name))}>
            <Flag className="h-3.5 w-3.5" />
            Marquer urgent
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <UserCog className="h-3.5 w-3.5" />
                Réassigner à...
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {agents.map((a) => (
                <DropdownMenuItem key={a.id} onSelect={() => selectedRows.forEach((b) => reassignBooking(b.id, a.name, user.name))}>
                  {a.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={() => alert(`Rappel envoyé à ${selectedRows.length} client(s) (simulation).`)}>
            <Send className="h-3.5 w-3.5" />
            Envoyer un rappel
          </Button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(b) => b.id}
        onRowClick={(b) => router.push(`/admin/reservations/${b.id}`)}
        enableSelection
        onSelectionChange={setSelectedRows}
        rowClassName={(b) => cn(lateBookingIds.has(b.id) && "bg-red-50/60 dark:bg-red-900/20", !lateBookingIds.has(b.id) && b.urgent && "bg-amber-50/60 dark:bg-amber-900/20")}
        onExportCsv={() => exportRowsToCsv(filtered, csvHeaders, `reservations-${Date.now()}`)}
        emptyMessage="Aucune réservation ne correspond aux filtres."
      />
    </div>
  );
}
