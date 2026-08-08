"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, Plus, Copy, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  CommTemplateFormDialog,
  CommunicationTemplateRow,
  PHASE_LABELS,
  CHANNEL_LABELS,
} from "@/components/admin/CommTemplateFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { deleteTaskTemplateAction, duplicateTaskTemplateAction, deleteCommunicationTemplateAction } from "./actions";
import type { TaskTemplateRow } from "@/lib/server/task-templates";
import {
  useSuppliers,
  createEmptySupplier,
  upsertSupplier,
  deleteSupplier,
} from "@/lib/admin/store/suppliers-store";
import { Supplier, SupplierType } from "@/lib/admin/types";

const SUPPLIER_TYPE_LABELS: Record<SupplierType, string> = {
  HEBERGEMENT: "Hébergement",
  TRANSPORT: "Transport",
  GUIDE_LOCAL: "Guide local",
  RESTAURATION: "Restauration",
  AUTRE: "Autre",
};

function TaskTemplatesTab({ templates }: { templates: TaskTemplateRow[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = React.useState<TaskTemplateRow | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleDuplicate(id: string) {
    setError(null);
    const result = await duplicateTaskTemplateAction(id);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.data) router.push(`/admin/voyages/modeles/${result.data.id}`);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteTaskTemplateAction(deleteTarget.id);
    setDeleteTarget(null);
    router.refresh();
  }

  const columns = React.useMemo<ColumnDef<TaskTemplateRow, any>[]>(
    () => [
      { accessorKey: "name", header: "Modèle", cell: ({ row }) => <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.name}</span> },
      {
        id: "theme",
        header: "Thème",
        cell: ({ row }) => (row.original.circuit_theme ? <StatusBadge status={row.original.circuit_theme} label={row.original.circuit_theme} /> : <span className="text-sm text-stone-400 dark:text-stone-500">—</span>),
      },
      {
        id: "items",
        header: "Tâches",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.task_template_items.length}</span>,
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
              <DropdownMenuItem onSelect={() => router.push(`/admin/voyages/modeles/${row.original.id}`)}>
                <Pencil className="h-3.5 w-3.5" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleDuplicate(row.original.id)}>
                <Copy className="h-3.5 w-3.5" />
                Dupliquer
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDeleteTarget(row.original)} className="text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer
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
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}
      <div className="flex items-center justify-end">
        <Button asChild size="sm">
          <Link href="/admin/voyages/modeles/new">
            <Plus className="h-3.5 w-3.5" />
            Nouveau modèle de tâches
          </Link>
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={templates}
        getRowId={(t) => t.id}
        onRowClick={(t) => router.push(`/admin/voyages/modeles/${t.id}`)}
        emptyMessage="Aucun modèle de tâches."
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Supprimer ce modèle ?"
        description="Cette action ne modifie pas les tâches déjà générées sur les voyages existants."
        destructive
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
      />
    </div>
  );
}

function CommTemplatesTab({ templates }: { templates: CommunicationTemplateRow[] }) {
  const router = useRouter();
  const tripTemplates = React.useMemo(() => templates.filter((t) => t.scope === "TRIP"), [templates]);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CommunicationTemplateRow | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<CommunicationTemplateRow | null>(null);

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteCommunicationTemplateAction(deleteTarget.id);
    setDeleteTarget(null);
    router.refresh();
  }

  const columns = React.useMemo<ColumnDef<CommunicationTemplateRow, any>[]>(
    () => [
      { accessorKey: "name", header: "Modèle", cell: ({ row }) => <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.name}</span> },
      { id: "phase", header: "Phase", cell: ({ row }) => row.original.phase ? <StatusBadge status={row.original.phase} label={PHASE_LABELS[row.original.phase as keyof typeof PHASE_LABELS]} /> : <span className="text-sm text-stone-400 dark:text-stone-500">—</span> },
      { id: "channel", header: "Canal", cell: ({ row }) => <StatusBadge status={row.original.channel} label={CHANNEL_LABELS[row.original.channel as keyof typeof CHANNEL_LABELS]} /> },
      {
        id: "body",
        header: "Aperçu",
        cell: ({ row }) => <span className="text-sm text-stone-500 line-clamp-1 max-w-xs block dark:text-stone-400">{row.original.body}</span>,
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
              <DropdownMenuItem onSelect={() => setDeleteTarget(row.original)} className="text-red-600">
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
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-3.5 w-3.5" />
          Nouveau modèle de communication
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={tripTemplates}
        getRowId={(t) => t.id}
        onRowClick={(t) => { setEditing(t); setFormOpen(true); }}
        emptyMessage="Aucun modèle de communication."
      />
      <CommTemplateFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} scope="TRIP" />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Supprimer ce modèle ?"
        description="Les communications déjà générées ne sont pas affectées."
        destructive
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
      />
    </div>
  );
}

function SupplierFormDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Supplier | null;
}) {
  const [form, setForm] = React.useState<Supplier>(() => editing ?? createEmptySupplier());

  React.useEffect(() => {
    if (open) setForm(editing ?? createEmptySupplier());
  }, [open, editing]);

  function set<K extends keyof Supplier>(key: K, value: Supplier[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const valid = form.name.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier le fournisseur" : "Nouveau fournisseur"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Nom</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex. Lodge Pendjari" />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set("type", v as SupplierType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(SUPPLIER_TYPE_LABELS) as SupplierType[]).map((t) => (
                  <SelectItem key={t} value={t}>{SUPPLIER_TYPE_LABELS[t]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Contact</Label>
              <Input value={form.contactName ?? ""} onChange={(e) => set("contactName", e.target.value)} placeholder="Nom du contact" />
            </div>
            <div className="space-y-1.5">
              <Label>Téléphone</Label>
              <Input value={form.contactPhone ?? ""} onChange={(e) => set("contactPhone", e.target.value)} placeholder="+229 ..." />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={form.contactEmail ?? ""} onChange={(e) => set("contactEmail", e.target.value)} placeholder="contact@fournisseur.bj" />
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea rows={3} value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} placeholder="Notes internes..." />
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
            <Checkbox checked={form.active} onCheckedChange={(v) => set("active", Boolean(v))} />
            Fournisseur actif
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button
            disabled={!valid}
            onClick={() => {
              upsertSupplier(form);
              onOpenChange(false);
            }}
          >
            {editing ? "Enregistrer" : "Créer le fournisseur"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SuppliersTab() {
  const suppliers = useSuppliers();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Supplier | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Supplier | null>(null);

  const columns = React.useMemo<ColumnDef<Supplier, any>[]>(
    () => [
      { accessorKey: "name", header: "Fournisseur", cell: ({ row }) => <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.name}</span> },
      { id: "type", header: "Type", cell: ({ row }) => <StatusBadge status={row.original.type} label={SUPPLIER_TYPE_LABELS[row.original.type]} /> },
      { id: "contact", header: "Contact", cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.contactName ?? "—"}</span> },
      { id: "phone", header: "Téléphone", cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.contactPhone ?? "—"}</span> },
      {
        id: "active",
        header: "Statut",
        cell: ({ row }) => (
          <StatusBadge status={row.original.active ? "ACTIVE" : "INACTIVE"} label={row.original.active ? "Actif" : "Inactif"} />
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
              <DropdownMenuItem onSelect={() => setDeleteTarget(row.original)} className="text-red-600">
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
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-3.5 w-3.5" />
          Nouveau fournisseur
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={suppliers}
        getRowId={(s) => s.id}
        onRowClick={(s) => { setEditing(s); setFormOpen(true); }}
        emptyMessage="Aucun fournisseur."
      />
      <SupplierFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Supprimer ce fournisseur ?"
        description="Les tâches déjà générées référençant ce fournisseur conserveront son identifiant."
        destructive
        confirmLabel="Supprimer"
        onConfirm={() => deleteTarget && deleteSupplier(deleteTarget.id)}
      />
    </div>
  );
}

interface ModelesClientProps {
  taskTemplates: TaskTemplateRow[];
  commTemplates: CommunicationTemplateRow[];
}

export function ModelesClient({ taskTemplates, commTemplates }: ModelesClientProps) {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/voyages")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Modèles de voyage</h1>
          <p className="text-sm text-stone-500 mt-0.5 dark:text-stone-400">Tâches et communications réutilisables par type de circuit.</p>
        </div>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Modèles de tâches</TabsTrigger>
          <TabsTrigger value="comms">Modèles de communication</TabsTrigger>
          <TabsTrigger value="suppliers">Fournisseurs</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks"><TaskTemplatesTab templates={taskTemplates} /></TabsContent>
        <TabsContent value="comms"><CommTemplatesTab templates={commTemplates} /></TabsContent>
        <TabsContent value="suppliers"><SuppliersTab /></TabsContent>
      </Tabs>
    </div>
  );
}
