"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search, X, Pencil, CheckCircle2, Ban, ArrowRight } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createFlightBookingAction, updateFlightBookingAction, setFlightBookingStatusAction } from "./actions";
import type { FlightBookingRow } from "@/lib/server/flights";
import type { Tables } from "@/lib/server/types";

type FlightStatus = Tables<"flight_bookings">["status"];
type ClientRef = Tables<"clients">;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatXOF(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

const CLASS_LABELS: Record<string, string> = {
  ECONOMY: "Économique",
  PREMIUM_ECONOMY: "Éco Premium",
  BUSINESS: "Affaires",
  FIRST: "Première",
};

const STATUS_LABELS: Record<FlightStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
  COMPLETED: "Terminée",
};

interface FormValues {
  clientId: string;
  origin: string;
  destination: string;
  departDate: string;
  returnDate: string;
  passengers: string;
  flightClass: string;
  priceXof: string;
  pnrCode: string;
}

function emptyForm(clients: ClientRef[]): FormValues {
  return {
    clientId: clients[0]?.id ?? "",
    origin: "Cotonou (COO)",
    destination: "",
    departDate: "",
    returnDate: "",
    passengers: "1",
    flightClass: "ECONOMY",
    priceXof: "",
    pnrCode: "",
  };
}

function formFromBooking(booking: FlightBookingRow): FormValues {
  return {
    clientId: booking.client_id,
    origin: booking.origin,
    destination: booking.destination,
    departDate: booking.depart_date,
    returnDate: booking.return_date ?? "",
    passengers: String(booking.passengers),
    flightClass: booking.flight_class,
    priceXof: String(booking.price_xof),
    pnrCode: booking.pnr_code ?? "",
  };
}

function FlightBookingDialog({
  open,
  onOpenChange,
  editing,
  clients,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: FlightBookingRow | null;
  clients: ClientRef[];
  onSaved: () => void;
}) {
  const [form, setForm] = React.useState<FormValues>(() => emptyForm(clients));
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setForm(editing ? formFromBooking(editing) : emptyForm(clients));
      setError(null);
    }
  }, [open, editing, clients]);

  const valid =
    Boolean(form.clientId) &&
    form.origin.trim().length > 1 &&
    form.destination.trim().length > 1 &&
    Boolean(form.departDate) &&
    Number(form.passengers) > 0 &&
    Number(form.priceXof) > 0;

  async function submit() {
    if (!valid) return;
    setSaving(true);
    setError(null);
    const payload = {
      client_id: form.clientId,
      origin: form.origin.trim(),
      destination: form.destination.trim(),
      depart_date: form.departDate,
      return_date: form.returnDate || null,
      passengers: Number(form.passengers),
      flight_class: form.flightClass,
      price_xof: Number(form.priceXof),
      pnr_code: form.pnrCode.trim() || null,
    };
    const result = editing
      ? await updateFlightBookingAction(editing.id, payload)
      : await createFlightBookingAction(payload);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onOpenChange(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier la réservation de vol" : "Nouvelle réservation de vol"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Client</Label>
            <Select value={form.clientId} onValueChange={(v) => setForm((f) => ({ ...f, clientId: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Origine</Label>
              <Input value={form.origin} onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))} placeholder="Cotonou (COO)" />
            </div>
            <div className="space-y-1.5">
              <Label>Destination</Label>
              <Input value={form.destination} onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))} placeholder="Paris (CDG)" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date de départ</Label>
              <Input type="date" value={form.departDate} onChange={(e) => setForm((f) => ({ ...f, departDate: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Date de retour (optionnel)</Label>
              <Input type="date" value={form.returnDate} onChange={(e) => setForm((f) => ({ ...f, returnDate: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Passagers</Label>
              <Input type="number" min={1} value={form.passengers} onChange={(e) => setForm((f) => ({ ...f, passengers: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Classe</Label>
              <Select value={form.flightClass} onValueChange={(v) => setForm((f) => ({ ...f, flightClass: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CLASS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Prix (FCFA)</Label>
              <Input type="number" min={0} value={form.priceXof} onChange={(e) => setForm((f) => ({ ...f, priceXof: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Code PNR (optionnel)</Label>
              <Input value={form.pnrCode} onChange={(e) => setForm((f) => ({ ...f, pnrCode: e.target.value }))} placeholder="Ex. XZ7QK2" />
            </div>
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button disabled={!valid || saving} onClick={submit}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function VolsClient({ bookings, clients }: { bookings: FlightBookingRow[]; clients: ClientRef[] }) {
  const router = useRouter();
  const [items, setItems] = React.useState(bookings);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("ALL");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<FlightBookingRow | null>(null);
  const [cancelTarget, setCancelTarget] = React.useState<FlightBookingRow | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setItems(bookings);
  }, [bookings]);

  const filtered = React.useMemo(() => {
    return items.filter((b) => {
      const q = search.toLowerCase();
      if (
        q &&
        !(b.clients?.name ?? "").toLowerCase().includes(q) &&
        !b.origin.toLowerCase().includes(q) &&
        !b.destination.toLowerCase().includes(q) &&
        !(b.pnr_code ?? "").toLowerCase().includes(q)
      )
        return false;
      if (status !== "ALL" && b.status !== status) return false;
      return true;
    });
  }, [items, search, status]);

  async function refreshStatus(id: string, next: FlightStatus) {
    setActionError(null);
    const result = await setFlightBookingStatusAction(id, next);
    if (result.error) {
      setActionError(result.error);
      return;
    }
    setItems((prev) => prev.map((b) => (b.id === id ? { ...b, status: next } : b)));
    router.refresh();
  }

  const columns = React.useMemo<ColumnDef<FlightBookingRow, any>[]>(
    () => [
      {
        id: "client",
        header: "Client",
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.clients?.name ?? "—"}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500">{row.original.pnr_code ?? "Sans PNR"}</p>
          </div>
        ),
      },
      {
        id: "route",
        header: "Trajet",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-sm text-stone-700 dark:text-stone-300">
            <span>{row.original.origin}</span>
            <ArrowRight className="h-3 w-3 text-stone-400" />
            <span>{row.original.destination}</span>
          </div>
        ),
      },
      {
        id: "dates",
        header: "Dates",
        cell: ({ row }) => (
          <span className="text-sm text-stone-600 dark:text-stone-400">
            {formatDate(row.original.depart_date)}
            {row.original.return_date ? ` → ${formatDate(row.original.return_date)}` : ""}
          </span>
        ),
      },
      { accessorKey: "passengers", header: "Pax", cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.passengers}</span> },
      {
        id: "class",
        header: "Classe",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{CLASS_LABELS[row.original.flight_class] ?? row.original.flight_class}</span>,
      },
      {
        id: "price",
        header: "Prix",
        cell: ({ row }) => <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">{formatXOF(row.original.price_xof)}</span>,
      },
      { id: "status", header: "Statut", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => {
          const b = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onSelect={() => { setEditing(b); setFormOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" />
                  Modifier
                </DropdownMenuItem>
                {b.status === "PENDING" && (
                  <DropdownMenuItem onSelect={() => refreshStatus(b.id, "CONFIRMED")}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Confirmer
                  </DropdownMenuItem>
                )}
                {b.status === "CONFIRMED" && (
                  <DropdownMenuItem onSelect={() => refreshStatus(b.id, "COMPLETED")}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Marquer terminée
                  </DropdownMenuItem>
                )}
                {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                  <DropdownMenuItem onSelect={() => setCancelTarget(b)}>
                    <Ban className="h-3.5 w-3.5" />
                    Annuler
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Vols</h1>
          <p className="text-sm text-stone-500 mt-0.5 dark:text-stone-400">{filtered.length} réservation{filtered.length > 1 ? "s" : ""} sur {items.length}</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" />
          Nouvelle réservation
        </Button>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-3 flex flex-wrap items-center gap-2 dark:border-stone-800 dark:bg-stone-900">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          <Input placeholder="Client, trajet ou PNR..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            {(Object.keys(STATUS_LABELS) as FlightStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || status !== "ALL") && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setStatus("ALL"); }}>
            <X className="h-3.5 w-3.5" />
            Réinitialiser
          </Button>
        )}
      </div>

      {actionError && <p className="text-sm text-red-600 dark:text-red-400">{actionError}</p>}

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(b) => b.id}
        emptyMessage="Aucune réservation de vol ne correspond aux filtres."
      />

      <FlightBookingDialog
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditing(null); }}
        editing={editing}
        clients={clients}
        onSaved={() => {
          setEditing(null);
          router.refresh();
        }}
      />

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title="Annuler cette réservation de vol ?"
        description="Le vol sera marqué comme annulé. Cette action peut être effectuée avant le départ."
        destructive
        confirmLabel="Annuler la réservation"
        onConfirm={async () => {
          if (!cancelTarget) return;
          await refreshStatus(cancelTarget.id, "CANCELLED");
        }}
      />
    </div>
  );
}
