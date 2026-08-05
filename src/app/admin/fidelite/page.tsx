"use client";
import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  useLoyaltyOffers,
  getLoyaltyOffer,
  createEmptyLoyaltyOffer,
  upsertLoyaltyOffer,
  deleteLoyaltyOffer,
  VIP_TIERS,
} from "@/lib/admin/store/loyalty-store";
import { LoyaltyOffer, VipTier } from "@/lib/admin/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const TIER_LABELS: Record<VipTier, string> = {
  STANDARD: "Standard",
  SILVER: "Argent",
  GOLD: "Or",
  PLATINUM: "Platine",
};

function OfferFormDialog({
  open,
  onOpenChange,
  editingId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
}) {
  const [form, setForm] = React.useState<LoyaltyOffer>(createEmptyLoyaltyOffer());

  React.useEffect(() => {
    if (open) {
      const existing = editingId ? getLoyaltyOffer(editingId) : undefined;
      setForm(existing ?? createEmptyLoyaltyOffer());
    }
  }, [open, editingId]);

  const valid = form.title.trim().length > 1 && form.description.trim().length > 1;

  function submit() {
    if (!valid) return;
    upsertLoyaltyOffer({ ...form, title: form.title.trim(), description: form.description.trim() });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingId ? "Modifier l'offre" : "Nouvelle offre"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Titre</Label>
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Ex. Surclassement hébergement" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Décrire l'avantage offert au client..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Palier requis</Label>
              <Select value={form.tierRequired} onValueChange={(v) => setForm((f) => ({ ...f, tierRequired: v as VipTier }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VIP_TIERS.map((t) => (
                    <SelectItem key={t} value={t}>{TIER_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Réduction (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.discountPercent ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, discountPercent: e.target.value ? Number(e.target.value) : undefined }))}
                placeholder="Optionnel"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Valable jusqu&apos;au</Label>
            <Input
              type="date"
              value={form.validUntil ? form.validUntil.slice(0, 10) : ""}
              onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
            />
          </div>
          <label className="flex items-center gap-2.5 text-sm text-stone-700 cursor-pointer dark:text-stone-300">
            <Checkbox checked={form.active} onCheckedChange={(v) => setForm((f) => ({ ...f, active: Boolean(v) }))} />
            Offre active
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button disabled={!valid} onClick={submit}>{editingId ? "Enregistrer" : "Créer l'offre"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function FidelitePage() {
  const offers = useLoyaltyOffers();
  const [search, setSearch] = React.useState("");
  const [tier, setTier] = React.useState<string>("ALL");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<LoyaltyOffer | null>(null);

  const filtered = React.useMemo(() => {
    return offers.filter((o) => {
      if (search && !o.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (tier !== "ALL" && o.tierRequired !== tier) return false;
      return true;
    });
  }, [offers, search, tier]);

  const columns = React.useMemo<ColumnDef<LoyaltyOffer, any>[]>(
    () => [
      {
        id: "title",
        header: "Offre",
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.title}</p>
            <p className="text-xs text-stone-400 line-clamp-1 dark:text-stone-500">{row.original.description}</p>
          </div>
        ),
      },
      { id: "tier", header: "Palier requis", cell: ({ row }) => <StatusBadge status={row.original.tierRequired} /> },
      {
        id: "discount",
        header: "Réduction",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.discountPercent ? `${row.original.discountPercent}%` : "—"}</span>,
      },
      {
        id: "validUntil",
        header: "Valable jusqu'au",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.validUntil ? formatDate(row.original.validUntil) : "—"}</span>,
      },
      {
        id: "active",
        header: "Statut",
        cell: ({ row }) => (
          <StatusBadge status={row.original.active ? "PUBLISHED" : "DRAFT"} label={row.original.active ? "Active" : "Inactive"} />
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
              <DropdownMenuItem onSelect={() => { setEditingId(row.original.id); setFormOpen(true); }}>
                <Pencil className="h-3.5 w-3.5" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDeleteTarget(row.original)}>
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Fidélité & VIP</h1>
          <p className="text-sm text-stone-500 mt-0.5 dark:text-stone-400">{filtered.length} offre{filtered.length > 1 ? "s" : ""} sur {offers.length}</p>
        </div>
        <Button onClick={() => { setEditingId(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" />
          Nouvelle offre
        </Button>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-3 flex flex-wrap items-center gap-2 dark:border-stone-800 dark:bg-stone-900">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          <Input placeholder="Titre de l'offre..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={tier} onValueChange={setTier}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Palier" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les paliers</SelectItem>
            {VIP_TIERS.map((t) => (
              <SelectItem key={t} value={t}>{TIER_LABELS[t]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(o) => o.id}
        onRowClick={(o) => { setEditingId(o.id); setFormOpen(true); }}
        emptyMessage="Aucune offre ne correspond aux filtres."
      />

      <OfferFormDialog open={formOpen} onOpenChange={setFormOpen} editingId={editingId} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Supprimer cette offre ?"
        description="Elle ne sera plus proposée aux clients éligibles."
        destructive
        confirmLabel="Supprimer"
        onConfirm={() => {
          if (deleteTarget) deleteLoyaltyOffer(deleteTarget.id);
        }}
      />
    </div>
  );
}
