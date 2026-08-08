"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search, X } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { RequireRole } from "@/components/admin/RequireRole";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useAdminRole } from "@/context/AdminRoleContext";
import { useSupportStore, createTicket } from "@/lib/admin/store/support-store";
import { CLIENTS } from "@/lib/admin/mock/clients";
import { SupportTicket, TicketChannel, TicketPriority, TicketStatus, TicketType } from "@/lib/admin/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const TYPE_LABELS: Record<TicketType, string> = {
  SUPPORT: "Support",
  RECLAMATION: "Réclamation",
};
const CHANNEL_LABELS: Record<TicketChannel, string> = {
  CHAT: "Chat",
  EMAIL: "Email",
  TELEPHONE: "Téléphone",
};
const STATUS_LABELS: Record<TicketStatus, string> = {
  OUVERT: "Ouvert",
  EN_COURS: "En cours",
  RESOLU: "Résolu",
  FERME: "Fermé",
  REJETE: "Rejeté",
};

const EMPTY_FORM = {
  clientId: CLIENTS[0]?.id ?? "",
  type: "SUPPORT" as TicketType,
  channel: "EMAIL" as TicketChannel,
  priority: "NORMALE" as TicketPriority,
  subject: "",
  message: "",
};

function NewTicketDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { user } = useAdminRole();
  const [form, setForm] = React.useState(EMPTY_FORM);

  React.useEffect(() => {
    if (open) setForm(EMPTY_FORM);
  }, [open]);

  const valid = form.clientId && form.subject.trim().length > 2 && form.message.trim().length > 2;

  const submit = () => {
    if (!valid) return;
    const client = CLIENTS.find((c) => c.id === form.clientId);
    if (!client) return;
    createTicket(
      { client, type: form.type, channel: form.channel, subject: form.subject.trim(), priority: form.priority, message: form.message.trim() },
      user.name
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau ticket</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Client</Label>
            <Select value={form.clientId} onValueChange={(v) => setForm((f) => ({ ...f, clientId: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CLIENTS.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as TicketType }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(TYPE_LABELS) as TicketType[]).map((t) => (
                    <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Canal</Label>
              <Select value={form.channel} onValueChange={(v) => setForm((f) => ({ ...f, channel: v as TicketChannel }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CHANNEL_LABELS) as TicketChannel[]).map((c) => (
                    <SelectItem key={c} value={c}>{CHANNEL_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Priorité</Label>
            <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v as TicketPriority }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="NORMALE">Normale</SelectItem>
                <SelectItem value="URGENTE">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Sujet</Label>
            <Input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="Ex. Chambre non conforme" />
          </div>
          <div className="space-y-1.5">
            <Label>Message initial</Label>
            <Textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Décrire la demande ou la réclamation du client..." rows={4} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button disabled={!valid} onClick={submit}>Créer le ticket</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SupportContent() {
  const router = useRouter();
  const store = useSupportStore();
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("ALL");
  const [channel, setChannel] = React.useState("ALL");
  const [status, setStatus] = React.useState("ALL");
  const [priority, setPriority] = React.useState("ALL");
  const [formOpen, setFormOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    return store.tickets.filter((t) => {
      if (search && !t.client.name.toLowerCase().includes(search.toLowerCase()) && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
      if (type !== "ALL" && t.type !== type) return false;
      if (channel !== "ALL" && t.channel !== channel) return false;
      if (status !== "ALL" && t.status !== status) return false;
      if (priority !== "ALL" && t.priority !== priority) return false;
      return true;
    });
  }, [store.tickets, search, type, channel, status, priority]);

  const columns = React.useMemo<ColumnDef<SupportTicket, any>[]>(
    () => [
      {
        id: "client",
        header: "Client",
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.client.name}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500">{row.original.subject}</p>
          </div>
        ),
      },
      {
        id: "type",
        header: "Type",
        cell: ({ row }) => <StatusBadge status={row.original.type} />,
      },
      { id: "channel", header: "Canal", cell: ({ row }) => <StatusBadge status={row.original.channel} /> },
      { id: "status", header: "Statut", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
      { id: "priority", header: "Priorité", cell: ({ row }) => <StatusBadge status={row.original.priority} /> },
      { accessorKey: "agent", header: "Agent" },
      {
        id: "updatedAt",
        header: "Mis à jour",
        cell: ({ row }) => <span className="text-sm text-stone-500 dark:text-stone-400">{formatDate(row.original.updatedAt)}</span>,
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Support & Réclamations</h1>
          <p className="text-sm text-stone-500 mt-0.5 dark:text-stone-400">{filtered.length} résultat{filtered.length > 1 ? "s" : ""} sur {store.tickets.length}</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Nouveau ticket
        </Button>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-3 flex flex-wrap items-center gap-2 dark:border-stone-800 dark:bg-stone-900">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          <Input placeholder="Client ou sujet..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les types</SelectItem>
            {(Object.keys(TYPE_LABELS) as TicketType[]).map((t) => (
              <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={channel} onValueChange={setChannel}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Canal" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les canaux</SelectItem>
            {(Object.keys(CHANNEL_LABELS) as TicketChannel[]).map((c) => (
              <SelectItem key={c} value={c}>{CHANNEL_LABELS[c]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            {(Object.keys(STATUS_LABELS) as TicketStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Priorité" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes priorités</SelectItem>
            <SelectItem value="NORMALE">Normale</SelectItem>
            <SelectItem value="URGENTE">Urgente</SelectItem>
          </SelectContent>
        </Select>
        {(search || type !== "ALL" || channel !== "ALL" || status !== "ALL" || priority !== "ALL") && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setType("ALL"); setChannel("ALL"); setStatus("ALL"); setPriority("ALL"); }}>
            <X className="h-3.5 w-3.5" />
            Réinitialiser
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(t) => t.id}
        onRowClick={(t) => router.push(`/admin/support/${t.id}`)}
        emptyMessage="Aucun ticket ne correspond aux filtres."
      />

      <NewTicketDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}

export default function SupportPage() {
  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <SupportContent />
    </RequireRole>
  );
}
