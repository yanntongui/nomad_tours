"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { upsertTaskTemplate } from "@/lib/admin/store/task-templates-store";
import { useCommunicationTemplates } from "@/lib/admin/store/communication-templates-store";
import { TASK_TEMPLATES } from "@/lib/admin/mock/task-templates";
import { TaskTemplate, TaskTemplateItem, TaskCategory, TaskPhase, TaskPriority, CommTriggerMode } from "@/lib/admin/types";

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

const ALL_ITEM_TITLES = Array.from(new Set(TASK_TEMPLATES.flatMap((t) => t.items.map((i) => i.title))));

function dueOffsetLabel(offset: number) {
  if (offset === 0) return "Jour 1 (arrivée)";
  if (offset < 0) return `J-${Math.abs(offset)}`;
  return `J+${offset}`;
}

let itemSeq = 0;
function newItemId() {
  itemSeq += 1;
  return `tti-new-${itemSeq}`;
}

function emptyItem(): TaskTemplateItem {
  return {
    id: newItemId(),
    title: "",
    phase: "AVANT",
    category: "LOGISTIQUE",
    dueOffsetDays: -30,
    assigneeRole: "AGENT",
    priority: "NORMALE",
    subItems: [],
  };
}

function ItemEditDialog({
  open,
  onOpenChange,
  item,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: TaskTemplateItem | null;
  onSave: (item: TaskTemplateItem) => void;
}) {
  const [draft, setDraft] = React.useState<TaskTemplateItem>(item ?? emptyItem());
  const commTemplates = useCommunicationTemplates();

  React.useEffect(() => {
    if (open) setDraft(item ?? emptyItem());
  }, [open, item]);

  function set<K extends keyof TaskTemplateItem>(key: K, value: TaskTemplateItem[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  const titleSuggestions = ALL_ITEM_TITLES;
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
                value={draft.dueOffsetDays}
                onChange={(e) => set("dueOffsetDays", Number(e.target.value))}
              />
              <p className="text-xs text-stone-400 dark:text-stone-500">{dueOffsetLabel(draft.dueOffsetDays)}</p>
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
              <Input value={draft.assigneeRole} onChange={(e) => set("assigneeRole", e.target.value)} placeholder="AGENT, GUIDE..." />
            </div>
            <div className="space-y-1.5">
              <Label>Fournisseur lié</Label>
              <Input value={draft.supplierTag ?? ""} onChange={(e) => set("supplierTag", e.target.value || undefined)} placeholder="Ex. Hébergement" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Sous-tâches</Label>
            <TagListInput tags={draft.subItems} onChange={(v) => set("subItems", v)} placeholder="Ajouter une sous-tâche et appuyer sur Entrée..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Modèle de communication</Label>
              <Select
                value={draft.communicationTemplateId ?? "NONE"}
                onValueChange={(v) => set("communicationTemplateId", v === "NONE" ? undefined : v)}
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
                value={draft.communicationTrigger ?? "NONE"}
                onValueChange={(v) => set("communicationTrigger", v === "NONE" ? undefined : (v as CommTriggerMode))}
                disabled={!draft.communicationTemplateId}
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

interface TaskTemplateFormProps {
  initial: TaskTemplate;
  mode: "create" | "edit";
}

export function TaskTemplateForm({ initial, mode }: TaskTemplateFormProps) {
  const router = useRouter();
  const [form, setForm] = React.useState<TaskTemplate>(initial);
  const [editingItem, setEditingItem] = React.useState<TaskTemplateItem | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function set<K extends keyof TaskTemplate>(key: K, value: TaskTemplate[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    upsertTaskTemplate(form);
    router.push("/admin/voyages/modeles");
  }

  function openNewItem() {
    setEditingItem(null);
    setDialogOpen(true);
  }
  function openEditItem(item: TaskTemplateItem) {
    setEditingItem(item);
    setDialogOpen(true);
  }
  function saveItem(item: TaskTemplateItem) {
    const exists = form.items.some((i) => i.id === item.id);
    set("items", exists ? form.items.map((i) => (i.id === item.id ? item : i)) : [...form.items, item]);
  }
  function removeItem(id: string) {
    set("items", form.items.filter((i) => i.id !== id));
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
        <Button onClick={handleSave} disabled={!form.name.trim()}>Enregistrer</Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Informations</TabsTrigger>
          <TabsTrigger value="tasks">Tâches ({form.items.length})</TabsTrigger>
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
                  value={form.circuitTheme ?? "NONE"}
                  onValueChange={(v) => set("circuitTheme", v === "NONE" ? undefined : (v as TaskTemplate["circuitTheme"]))}
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
              {form.items.length === 0 ? (
                <p className="text-sm text-stone-400 dark:text-stone-500">Aucune tâche. Ajoutez la première.</p>
              ) : (
                <DragDropList
                  items={form.items}
                  onReorder={(items) => set("items", items)}
                  renderItem={(item) => (
                    <button type="button" className="flex w-full items-center gap-2 py-1 text-left" onClick={() => openEditItem(item)}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate dark:text-stone-100">{item.title}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <StatusBadge status={item.phase} label={PHASE_LABELS[item.phase]} />
                          <StatusBadge status={item.category} label={CATEGORY_LABELS[item.category]} />
                          <span className="text-xs text-stone-400 dark:text-stone-500">{dueOffsetLabel(item.dueOffsetDays)}</span>
                          <span className="text-xs text-stone-400 dark:text-stone-500">· {item.assigneeRole}</span>
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

      <ItemEditDialog open={dialogOpen} onOpenChange={setDialogOpen} item={editingItem} onSave={saveItem} />
    </div>
  );
}
