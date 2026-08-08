"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search, X, Send, UserCog, Flag, Package, Wallet, Clock, AlertTriangle, Bookmark, Trash2 } from "lucide-react";
import { DataTable, exportRowsToCsv } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { KpiCard } from "@/components/admin/KpiCard";
import { useSavedReservationsViews, SavedReservationsView } from "@/lib/admin/reservations-saved-filters";
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
import { toggleUrgentAction, reassignBookingAction } from "./actions";
import type { BookingListRow } from "@/lib/server/bookings";
import type { Tables } from "@/lib/server/types";
import { cn } from "@/lib/utils";

type AgentRow = Tables<"admin_profiles">;

function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}
function formatDate(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";
}

type QuickFilter = "ALL" | "LATE" | "URGENT" | "PENDING";

export function ReservationsClient({ bookings, agents }: { bookings: BookingListRow[]; agents: AgentRow[] }) {
  const router = useRouter();
  const { user } = useAdminRole();
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState<string>("ALL");
  const [status, setStatus] = React.useState<string>("ALL");
  const [paymentStatus, setPaymentStatus] = React.useState<string>("ALL");
  const [agent, setAgent] = React.useState<string>("ALL");
  const [quickFilter, setQuickFilter] = React.useState<QuickFilter>("ALL");
  const [selectedRows, setSelectedRows] = React.useState<BookingListRow[]>([]);
  const { views: savedViews, saveView, deleteView } = useSavedReservationsViews();
  const [savedViewsOpen, setSavedViewsOpen] = React.useState(false);
  const [newViewName, setNewViewName] = React.useState("");

  async function handleReassign(bookingId: string, agentRow: AgentRow) {
    await reassignBookingAction(bookingId, agentRow.id, agentRow.name, user.name);
    router.refresh();
  }

  async function handleToggleUrgent(bookingId: string, currentUrgent: boolean) {
    await toggleUrgentAction(bookingId, currentUrgent, user.name);
    router.refresh();
  }

  const lateBookingIds = React.useMemo(
    () =>
      new Set(
        bookings.filter((b) => b.payment_schedules.some((s) => s.status === "LATE")).map((b) => b.id)
      ),
    [bookings]
  );

  function isDepartingSoonUnconfirmed(b: BookingListRow) {
    if (b.status === "CONFIRMED" || b.status === "COMPLETED" || b.status === "CANCELLED") return false;
    if (!b.depart_date) return false;
    const daysUntilDepart = (new Date(b.depart_date).getTime() - Date.now()) / 86_400_000;
    return daysUntilDepart >= 0 && daysUntilDepart <= 7;
  }

  const filtered = React.useMemo(() => {
    return bookings.filter((b) => {
      if (search) {
        const q = search.toLowerCase();
        const matches =
          b.booking_number.toLowerCase().includes(q) ||
          (b.clients?.name ?? "").toLowerCase().includes(q) ||
          b.reference_label.toLowerCase().includes(q) ||
          (b.destination_name ?? "").toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (type !== "ALL" && b.type !== type) return false;
      if (status !== "ALL" && b.status !== status) return false;
      if (paymentStatus !== "ALL" && b.payment_status !== paymentStatus) return false;
      if (agent !== "ALL" && b.agent_id !== agent) return false;
      if (quickFilter === "LATE" && !lateBookingIds.has(b.id)) return false;
      if (quickFilter === "URGENT" && !b.urgent) return false;
      if (quickFilter === "PENDING" && b.status !== "PENDING") return false;
      return true;
    });
  }, [bookings, search, type, status, paymentStatus, agent, quickFilter, lateBookingIds]);

  const filteredStats = React.useMemo(() => {
    const totalAmount = filtered.reduce((sum, b) => sum + b.total_price_xof, 0);
    const pending = filtered.filter((b) => b.status === "PENDING").length;
    const late = filtered.filter((b) => lateBookingIds.has(b.id)).length;
    return { total: filtered.length, totalAmount, pending, late };
  }, [filtered, lateBookingIds]);

  const resetFilters = () => {
    setSearch("");
    setType("ALL");
    setStatus("ALL");
    setPaymentStatus("ALL");
    setAgent("ALL");
    setQuickFilter("ALL");
  };

  const currentFilters = { search, type, status, paymentStatus, agent, quickFilter };

  function applyView(v: SavedReservationsView) {
    setSearch(v.filters.search);
    setType(v.filters.type);
    setStatus(v.filters.status);
    setPaymentStatus(v.filters.paymentStatus);
    setAgent(v.filters.agent);
    setQuickFilter(v.filters.quickFilter as QuickFilter);
  }

  const csvHeaders: { key: keyof BookingListRow; label: string }[] = [
    { key: "booking_number", label: "Réf." },
    { key: "reference_label", label: "Prestation" },
    { key: "destination_name", label: "Destination" },
    { key: "type", label: "Type" },
    { key: "total_price_xof", label: "Montant (FCFA)" },
    { key: "paid_xof", label: "Payé (FCFA)" },
    { key: "status", label: "Statut" },
    { key: "payment_status", label: "Statut paiement" },
    { key: "depart_date", label: "Date de départ" },
  ];

  const columns = React.useMemo<ColumnDef<BookingListRow, any>[]>(
    () => [
      {
        accessorKey: "booking_number",
        header: "Réf.",
        cell: ({ row }) => <span className="font-mono text-xs font-semibold text-stone-700 dark:text-stone-300">{row.original.booking_number}</span>,
      },
      {
        id: "client",
        accessorFn: (b) => b.clients?.name ?? "",
        header: "Client",
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.clients?.name ?? "—"}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500">{row.original.clients?.phone}</p>
          </div>
        ),
      },
      {
        accessorKey: "reference_label",
        header: "Prestation",
        cell: ({ row }) => (
          <div className="max-w-[220px]">
            <p className="text-sm text-stone-700 dark:text-stone-300 truncate">{row.original.reference_label}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500">{row.original.destination_name}</p>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => <StatusBadge status={row.original.type} label={{ CIRCUIT: "Circuit", FLIGHT: "Vol", EVENT: "Événement" }[row.original.type]} />,
      },
      {
        accessorKey: "total_price_xof",
        header: "Montant",
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">{formatXOF(row.original.total_price_xof)}</p>
            {row.original.payment_status === "PARTIAL" && (
              <p className="text-[11px] text-amber-600">{formatXOF(row.original.paid_xof)} payé</p>
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
        accessorKey: "payment_status",
        header: "Paiement",
        cell: ({ row }) => <StatusBadge status={row.original.payment_status} />,
      },
      {
        accessorKey: "depart_date",
        header: "Départ",
        cell: ({ row }) => (
          <span className="text-sm text-stone-600 dark:text-stone-400">
            {formatDate(row.original.depart_date)}
            {row.original.urgent && <Flag className="inline-block h-3 w-3 text-red-500 ml-1 -mt-0.5" />}
          </span>
        ),
      },
      {
        id: "agent",
        header: "Agent",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.admin_profiles?.name ?? "—"}</span>,
      },
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
              <DropdownMenuItem onSelect={() => handleToggleUrgent(row.original.id, row.original.urgent)}>
                {row.original.urgent ? "Retirer l'urgence" : "Marquer urgent"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Réassigner</DropdownMenuLabel>
              {agents.map((a) => (
                <DropdownMenuItem key={a.id} onSelect={() => handleReassign(row.original.id, a)}>
                  {a.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, user.name, agents]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Réservations</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{filtered.length} résultat{filtered.length > 1 ? "s" : ""} sur {bookings.length}</p>
        </div>
        <Button asChild>
          <Link href="/admin/reservations/new">
            <Plus className="h-4 w-4" />
            Nouvelle réservation
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <KpiCard compact label="Résultats" value={String(filteredStats.total)} icon={Package} />
        <KpiCard compact label="Montant total" value={formatXOF(filteredStats.totalAmount)} icon={Wallet} />
        <KpiCard compact label="En attente" value={String(filteredStats.pending)} icon={Clock} />
        <KpiCard compact label="En retard" value={String(filteredStats.late)} icon={AlertTriangle} />
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
              <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <X className="h-3.5 w-3.5" />
          Réinitialiser
        </Button>
        <Button variant="outline" size="sm" onClick={() => setSavedViewsOpen((o) => !o)}>
          <Bookmark className="h-3.5 w-3.5" />
          Vues enregistrées{savedViews.length > 0 ? ` (${savedViews.length})` : ""}
        </Button>
      </div>

      {savedViewsOpen && (
        <div className="rounded-xl border border-stone-200 bg-white p-3 space-y-3 dark:border-stone-800 dark:bg-stone-900">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Nom de la vue..."
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              className="max-w-xs"
            />
            <Button
              variant="outline"
              size="sm"
              disabled={!newViewName.trim()}
              onClick={() => {
                saveView(newViewName.trim(), currentFilters);
                setNewViewName("");
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Enregistrer la vue actuelle
            </Button>
          </div>
          {savedViews.length === 0 ? (
            <p className="text-sm text-stone-400 dark:text-stone-500">Aucune vue enregistrée.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {savedViews.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 pl-3 pr-2 py-1 text-xs dark:border-stone-800 dark:bg-stone-800"
                >
                  <button
                    type="button"
                    className="font-semibold text-stone-700 hover:text-luxe-terracotta dark:text-stone-300"
                    onClick={() => applyView(v)}
                  >
                    {v.name}
                  </button>
                  <button type="button" onClick={() => deleteView(v.id)} className="text-stone-400 hover:text-red-500">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
          <Button variant="outline" size="sm" onClick={() => selectedRows.forEach((b) => handleToggleUrgent(b.id, b.urgent))}>
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
                <DropdownMenuItem key={a.id} onSelect={() => selectedRows.forEach((b) => handleReassign(b.id, a))}>
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
        rowClassName={(b) =>
          cn(
            lateBookingIds.has(b.id) && "bg-red-50/60 dark:bg-red-900/20",
            !lateBookingIds.has(b.id) && (b.urgent || isDepartingSoonUnconfirmed(b)) && "bg-amber-50/60 dark:bg-amber-900/20"
          )
        }
        onExportCsv={() => exportRowsToCsv(filtered, csvHeaders, `reservations-${Date.now()}`)}
        emptyMessage="Aucune réservation ne correspond aux filtres."
        storageKey="reservations"
      />
    </div>
  );
}
