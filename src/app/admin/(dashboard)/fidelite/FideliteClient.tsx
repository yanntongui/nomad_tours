"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
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
  createLoyaltyOfferAction,
  updateLoyaltyOfferAction,
  deleteLoyaltyOfferAction,
} from "./actions";
import { VIP_TIERS, VipTier } from "@/lib/admin/loyalty";
import type { Tables } from "@/lib/server/types";

export type LoyaltyOfferRow = Tables<"loyalty_offers">;

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const TIER_LABELS: Record<VipTier, string> = {
  STANDARD: "Standard",
  SILVER: "Argent",
  GOLD: "Or",
  PLATINUM: "Platine",
};

interface FormValues {
  title: string;
  description: string;
  tier_required: VipTier;
  discount_percent: number | null;
  valid_until: string | null;
  active: boolean;
}

function toFormValues(offer: LoyaltyOfferRow | null): FormValues {
  return {
    title: offer?.title ?? "",
    description: offer?.description ?? "",
    tier_required: (offer?.tier_required as VipTier) ?? "STANDARD",
    discount_percent: offer?.discount_percent ?? null,
    valid_until: offer?.valid_until ?? null,
    active: offer?.active ?? true,
  };
}

function OfferFormDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: LoyaltyOfferRow | null;
}) {
  const router = useRouter();
  const [form, setForm] = React.useState<FormValues>(() => toFormValues(editing));
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setForm(toFormValues(editing));
      setError(null);
    }
  }, [open, editing]);

  const valid = form.title.trim().length > 1 && form.description.trim().length > 1;

  async function submit() {
    if (!valid) return;
    setSaving(true);
    setError(null);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      tier_required: form.tier_required,
      discount_percent: form.discount_percent,
      valid_until: form.valid_until,
      active: form.active,
    };
    const result = editing
      ? await updateLoyaltyOfferAction(editing.id, payload)
      : await createLoyaltyOfferAction(payload);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier l'offre" : "Nouvelle offre"}</DialogTitle>
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
              <Select value={form.tier_required} onValueChange={(v) => setForm((f) => ({ ...f, tier_required: v as VipTier }))}>
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
                value={form.discount_percent ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, discount_percent: e.target.value ? Number(e.target.value) : null }))}
                placeholder="Optionnel"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Valable jusqu&apos;au</Label>
            <Input
              type="date"
              value={form.valid_until ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, valid_until: e.target.value || null }))}
            />
          </div>
          <label className="flex items-center gap-2.5 text-sm text-stone-700 cursor-pointer dark:text-stone-300">
            <Checkbox checked={form.active} onCheckedChange={(v) => setForm((f) => ({ ...f, active: Boolean(v) }))} />
            Offre active
          </label>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button disabled={!valid || saving} onClick={submit}>
            {saving ? "Enregistrement..." : editing ? "Enregistrer" : "Créer l'offre"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FideliteClient({ offers }: { offers: LoyaltyOfferRow[] }) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [tier, setTier] = React.useState<string>("ALL");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<LoyaltyOfferRow | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<LoyaltyOfferRow | null>(null);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return offers.filter((o) => {
      if (search && !o.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (tier !== "ALL" && o.tier_required !== tier) return false;
      return true;
    });
  }, [offers, search, tier]);

  const columns = React.useMemo<ColumnDef<LoyaltyOfferRow, any>[]>(
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
      { id: "tier", header: "Palier requis", cell: ({ row }) => <StatusBadge status={row.original.tier_required} /> },
      {
        id: "discount",
        header: "Réduction",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.discount_percent ? `${row.original.discount_percent}%` : "—"}</span>,
      },
      {
        id: "validUntil",
        header: "Valable jusqu'au",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.valid_until ? formatDate(row.original.valid_until) : "—"}</span>,
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
              <DropdownMenuItem onSelect={() => { setEditing(row.original); setFormOpen(true); }}>
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
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
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

      {deleteError && <p className="text-sm text-red-600 dark:text-red-400">{deleteError}</p>}

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(o) => o.id}
        onRowClick={(o) => { setEditing(o); setFormOpen(true); }}
        emptyMessage="Aucune offre ne correspond aux filtres."
      />

      <OfferFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Supprimer cette offre ?"
        description="Elle ne sera plus proposée aux clients éligibles."
        destructive
        confirmLabel="Supprimer"
        onConfirm={async () => {
          if (!deleteTarget) return;
          const result = await deleteLoyaltyOfferAction(deleteTarget.id);
          if (result.error) setDeleteError(result.error);
          else router.refresh();
        }}
      />
    </div>
  );
}
