"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, Plus, Copy, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
  useTaskTemplates,
  duplicateTaskTemplate,
  deleteTaskTemplate,
} from "@/lib/admin/store/task-templates-store";
import {
  useCommunicationTemplates,
  createEmptyCommunicationTemplate,
  upsertCommunicationTemplate,
  deleteCommunicationTemplate,
} from "@/lib/admin/store/communication-templates-store";
import { TaskTemplate, CommunicationTemplate, TaskPhase, CommChannel } from "@/lib/admin/types";

const PHASE_LABELS: Record<TaskPhase, string> = { AVANT: "Avant le voyage", PENDANT: "Pendant le voyage", APRES: "Après le voyage" };
const TONE_HINTS: Record<TaskPhase, string> = {
  AVANT: "Ton indicatif : rassurant / pratique",
  PENDANT: "Ton indicatif : informatif / chaleureux",
  APRES: "Ton indicatif : reconnaissant / fidélisation",
};
const CHANNEL_LABELS: Record<CommChannel, string> = { EMAIL: "Email", SMS: "SMS", PUSH: "Push" };

function TaskTemplatesTab() {
  const router = useRouter();
  const templates = useTaskTemplates();
  const [deleteTarget, setDeleteTarget] = React.useState<TaskTemplate | null>(null);

  const columns = React.useMemo<ColumnDef<TaskTemplate, any>[]>(
    () => [
      { accessorKey: "name", header: "Modèle", cell: ({ row }) => <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.name}</span> },
      {
        id: "theme",
        header: "Thème",
        cell: ({ row }) => (row.original.circuitTheme ? <StatusBadge status={row.original.circuitTheme} label={row.original.circuitTheme} /> : <span className="text-sm text-stone-400 dark:text-stone-500">—</span>),
      },
      {
        id: "items",
        header: "Tâches",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.items.length}</span>,
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
              <DropdownMenuItem
                onSelect={() => {
                  const copy = duplicateTaskTemplate(row.original.id);
                  if (copy) router.push(`/admin/voyages/modeles/${copy.id}`);
                }}
              >
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
        onConfirm={() => deleteTarget && deleteTaskTemplate(deleteTarget.id)}
      />
    </div>
  );
}

function CommTemplateFormDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: CommunicationTemplate | null;
}) {
  const [form, setForm] = React.useState<CommunicationTemplate>(() => editing ?? createEmptyCommunicationTemplate());

  React.useEffect(() => {
    if (open) setForm(editing ?? createEmptyCommunicationTemplate());
  }, [open, editing]);

  function set<K extends keyof CommunicationTemplate>(key: K, value: CommunicationTemplate[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const valid = form.name.trim().length > 0 && form.body.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier le modèle de communication" : "Nouveau modèle de communication"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Nom</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex. Rappel documents" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Phase</Label>
              <Select value={form.phase} onValueChange={(v) => set("phase", v as TaskPhase)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(PHASE_LABELS) as TaskPhase[]).map((p) => (
                    <SelectItem key={p} value={p}>{PHASE_LABELS[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-stone-400 dark:text-stone-500">{TONE_HINTS[form.phase]}</p>
            </div>
            <div className="space-y-1.5">
              <Label>Canal</Label>
              <Select value={form.channel} onValueChange={(v) => set("channel", v as CommChannel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CHANNEL_LABELS) as CommChannel[]).map((c) => (
                    <SelectItem key={c} value={c}>{CHANNEL_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {form.channel === "EMAIL" && (
            <div className="space-y-1.5">
              <Label>Objet</Label>
              <Input value={form.subject ?? ""} onChange={(e) => set("subject", e.target.value)} placeholder="Objet de l'email" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Message</Label>
            <Textarea rows={5} value={form.body} onChange={(e) => set("body", e.target.value)} placeholder="Bonjour {{prenom}}, ..." />
            <p className="text-xs text-stone-400 dark:text-stone-500">Variables disponibles : {"{{prenom}}"}, {"{{destination}}"}, {"{{date_depart}}"}, {"{{nom_guide}}"}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button
            disabled={!valid}
            onClick={() => {
              upsertCommunicationTemplate(form);
              onOpenChange(false);
            }}
          >
            {editing ? "Enregistrer" : "Créer le modèle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CommTemplatesTab() {
  const templates = useCommunicationTemplates();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CommunicationTemplate | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<CommunicationTemplate | null>(null);

  const columns = React.useMemo<ColumnDef<CommunicationTemplate, any>[]>(
    () => [
      { accessorKey: "name", header: "Modèle", cell: ({ row }) => <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.name}</span> },
      { id: "phase", header: "Phase", cell: ({ row }) => <StatusBadge status={row.original.phase} label={PHASE_LABELS[row.original.phase]} /> },
      { id: "channel", header: "Canal", cell: ({ row }) => <StatusBadge status={row.original.channel} label={CHANNEL_LABELS[row.original.channel]} /> },
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
        data={templates}
        getRowId={(t) => t.id}
        onRowClick={(t) => { setEditing(t); setFormOpen(true); }}
        emptyMessage="Aucun modèle de communication."
      />
      <CommTemplateFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Supprimer ce modèle ?"
        description="Les communications déjà générées ne sont pas affectées."
        destructive
        confirmLabel="Supprimer"
        onConfirm={() => deleteTarget && deleteCommunicationTemplate(deleteTarget.id)}
      />
    </div>
  );
}

export default function ModelesPage() {
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
        </TabsList>
        <TabsContent value="tasks"><TaskTemplatesTab /></TabsContent>
        <TabsContent value="comms"><CommTemplatesTab /></TabsContent>
      </Tabs>
    </div>
  );
}
