"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TagListInput } from "@/components/admin/TagListInput";
import { DragDropList } from "@/components/admin/DragDropList";
import { createTaskTemplateAction, updateTaskTemplateAction } from "@/app/admin/(dashboard)/voyages/modeles/actions";
import type { TaskTemplateRow } from "@/lib/server/task-templates";
import type { CommunicationTemplateRow } from "@/components/admin/CommTemplateFormDialog";
import type { Enums } from "@/lib/server/types";

type TaskPhase = Enums<"task_phase">;
type TaskCategory = Enums<"task_category">;
type TaskPriority = Enums<"task_priority">;
type CommTriggerMode = Enums<"comm_trigger_mode">;

const THEMES = ["Culture", "Safari", "Plage", "Aventure", "Événement"] as const;

const PHASE_LABELS: Record<TaskPhase, string> = { AVANT: "Avant le voyage", PENDANT: "Pendant le voyage", APRES: "Après le voyage" };
const CATEGORY_LABELS: Record<TaskCategory, string> = {
  LOGISTIQUE: "Logistique",
  FOURNISSEURS: "Fournisseurs",
  DOCUMENTS_CLIENT: "Documents client",
  COMMUNICATION: "Communication",
  FINANCE: "Finance",
};
const PRIORITY_LABELS: Record<TaskPriority, string> = { NORMALE: "Normale", URGENTE: "Urgente" };
const TRIGGER_LABELS: Record<CommTriggerMode, string> = { AUTO: "Automatique", VALIDATION: "Avec validation agent", MANUEL: "Manuel groupé" };

function dueOffsetLabel(offset: number) {
  if (offset === 0) return "Jour 1 (arrivée)";
  if (offset < 0) return `J-${Math.abs(offset)}`;
  return `J+${offset}`;
}

let itemSeq = 0;
function newTempId() {
  itemSeq += 1;
  return `tti-new-${Date.now()}-${itemSeq}`;
}

interface ItemDraft {
  id: string;
  title: string;
  phase: TaskPhase;
  category: TaskCategory;
  due_offset_days: number;
  assignee_role: string;
  priority: TaskPriority;
  sub_items: string[];
  supplier_tag: string | null;
  communication_template_id: string | null;
  communication_trigger: CommTriggerMode | null;
}

function emptyItem(): ItemDraft {
  return {
    id: newTempId(),
    title: "",
    phase: "AVANT",
    category: "LOGISTIQUE",
    due_offset_days: -30,
    assignee_role: "AGENT",
    priority: "NORMALE",
    sub_items: [],
    supplier_tag: null,
    communication_template_id: null,
    communication_trigger: null,
  };
}

function toItemDrafts(rows: TaskTemplateRow["task_template_items"]): ItemDraft[] {
  return rows
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((r) => ({
      id: r.id,
      title: r.title,
      phase: r.phase,
      category: r.category,
      due_offset_days: r.due_offset_days,
      assignee_role: r.assignee_role,
      priority: r.priority,
      sub_items: r.sub_items ?? [],
      supplier_tag: r.supplier_tag,
      communication_template_id: r.communication_template_id,
      communication_trigger: r.communication_trigger,
    }));
}

function ItemEditDialog({
  open,
  onOpenChange,
  item,
  onSave,
  commTemplates,
  titleSuggestions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ItemDraft | null;
  onSave: (item: ItemDraft) => void;
  commTemplates: CommunicationTemplateRow[];
  titleSuggestions: string[];
}) {
  const [draft, setDraft] = React.useState<ItemDraft>(item ?? emptyItem());

  React.useEffect(() => {
    if (open) setDraft(item ?? emptyItem());
  }, [open, item]);

  function set<K extends keyof ItemDraft>(key: K, value: ItemDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  const valid = draft.title.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Modifier la tâche" : "Nouvelle tâche"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Titre</Label>
            <Input
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Ex. Confirmer les réservations hôtels"
              list="task-item-titles"
            />
            <datalist id="task-item-titles">
              {titleSuggestions.filter((t) => t !== draft.title).map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Phase</Label>
              <Select value={draft.phase} onValueChange={(v) => set("phase", v as TaskPhase)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(PHASE_LABELS) as TaskPhase[]).map((p) => (
                    <SelectItem key={p} value={p}>{PHASE_LABELS[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Catégorie</Label>
              <Select value={draft.category} onValueChange={(v) => set("category", v as TaskCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CATEGORY_LABELS) as TaskCategory[]).map((c) => (
                    <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Échéance relative (jours)</Label>
              <Input
                type="number"
                value={draft.due_offset_days}
                onChange={(e) => set("due_offset_days", Number(e.target.value))}
              />
              <p className="text-xs text-stone-400 dark:text-stone-500">{dueOffsetLabel(draft.due_offset_days)}</p>
            </div>
            <div className="space-y-1.5">
              <Label>Priorité</Label>
              <Select value={draft.priority} onValueChange={(v) => set("priority", v as TaskPriority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
                    <SelectItem key={p} value={p}>{PRIORITY_LABELS[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Rôle assigné</Label>
              <Input value={draft.assignee_role} onChange={(e) => set("assignee_role", e.target.value)} placeholder="AGENT, GUIDE..." />
            </div>
            <div className="space-y-1.5">
              <Label>Fournisseur (tag libre)</Label>
              <Input
                value={draft.supplier_tag ?? ""}
                onChange={(e) => set("supplier_tag", e.target.value.trim() ? e.target.value : null)}
                placeholder="Ex. Lodge Pendjari"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Sous-tâches</Label>
            <TagListInput tags={draft.sub_items} onChange={(v) => set("sub_items", v)} placeholder="Ajouter une sous-tâche et appuyer sur Entrée..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Modèle de communication</Label>
              <Select
                value={draft.communication_template_id ?? "NONE"}
                onValueChange={(v) => set("communication_template_id", v === "NONE" ? null : v)}
              >
                <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Aucun</SelectItem>
                  {commTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Déclenchement</Label>
              <Select
                value={draft.communication_trigger ?? "NONE"}
                onValueChange={(v) => set("communication_trigger", v === "NONE" ? null : (v as CommTriggerMode))}
                disabled={!draft.communication_template_id}
              >
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">—</SelectItem>
                  {(Object.keys(TRIGGER_LABELS) as CommTriggerMode[]).map((t) => (
                    <SelectItem key={t} value={t}>{TRIGGER_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button disabled={!valid} onClick={() => { onSave(draft); onOpenChange(false); }}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface FormValues {
  name: string;
  circuit_theme: string | null;
}

function toFormValues(initial: TaskTemplateRow | null): FormValues {
  return { name: initial?.name ?? "", circuit_theme: initial?.circuit_theme ?? null };
}

interface TaskTemplateFormProps {
  initial: TaskTemplateRow | null;
  mode: "create" | "edit";
  commTemplates: CommunicationTemplateRow[];
  itemTitleSuggestions: string[];
}

export function TaskTemplateForm({ initial, mode, commTemplates, itemTitleSuggestions }: TaskTemplateFormProps) {
  const router = useRouter();
  const [form, setForm] = React.useState<FormValues>(() => toFormValues(initial));
  const [items, setItems] = React.useState<ItemDraft[]>(() => toItemDrafts(initial?.task_template_items ?? []));
  const [editingItem, setEditingItem] = React.useState<ItemDraft | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const itemsPayload = items.map(({ id, ...rest }, index) => ({ ...rest, position: index }));
    const result =
      mode === "create"
        ? await createTaskTemplateAction(form, itemsPayload)
        : await updateTaskTemplateAction(initial!.id, form, itemsPayload);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/admin/voyages/modeles");
  }

  function openNewItem() {
    setEditingItem(null);
    setDialogOpen(true);
  }
  function openEditItem(item: ItemDraft) {
    setEditingItem(item);
    setDialogOpen(true);
  }
  function saveItem(item: ItemDraft) {
    const exists = items.some((i) => i.id === item.id);
    setItems((list) => (exists ? list.map((i) => (i.id === item.id ? item : i)) : [...list, item]));
  }
  function removeItem(id: string) {
    setItems((list) => list.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/voyages/modeles")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100">{mode === "create" ? "Nouveau modèle de tâches" : form.name || "Modifier le modèle"}</h1>
        </div>
        <Button onClick={handleSave} disabled={!form.name.trim() || saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Informations</TabsTrigger>
          <TabsTrigger value="tasks">Tâches ({items.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nom du modèle</Label>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex. Safari international" />
              </div>
              <div className="space-y-1.5">
                <Label>Thème de circuit associé</Label>
                <Select
                  value={form.circuit_theme ?? "NONE"}
                  onValueChange={(v) => set("circuit_theme", v === "NONE" ? null : v)}
                >
                  <SelectTrigger><SelectValue placeholder="Aucun thème" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Aucun thème</SelectItem>
                    {THEMES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader><CardTitle className="text-sm">Liste des tâches</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {items.length === 0 ? (
                <p className="text-sm text-stone-400 dark:text-stone-500">Aucune tâche. Ajoutez la première.</p>
              ) : (
                <DragDropList
                  items={items}
                  onReorder={setItems}
                  renderItem={(item) => (
                    <button type="button" className="flex w-full items-center gap-2 py-1 text-left" onClick={() => openEditItem(item)}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate dark:text-stone-100">{item.title}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <StatusBadge status={item.phase} label={PHASE_LABELS[item.phase]} />
                          <StatusBadge status={item.category} label={CATEGORY_LABELS[item.category]} />
                          <span className="text-xs text-stone-400 dark:text-stone-500">{dueOffsetLabel(item.due_offset_days)}</span>
                          <span className="text-xs text-stone-400 dark:text-stone-500">· {item.assignee_role}</span>
                          {item.priority === "URGENTE" && <StatusBadge status="URGENTE" label="Urgente" />}
                        </div>
                      </div>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                        className="rounded p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:text-stone-500 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  )}
                />
              )}
              <Button variant="outline" size="sm" onClick={openNewItem}>
                <Plus className="h-3.5 w-3.5" />
                Ajouter une tâche
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ItemEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
        onSave={saveItem}
        commTemplates={commTemplates}
        titleSuggestions={itemTitleSuggestions}
      />
    </div>
  );
}
