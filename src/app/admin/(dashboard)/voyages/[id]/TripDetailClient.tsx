"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  PlayCircle,
  StopCircle,
  Star,
  FileDown,
  Plus,
  Send,
  X,
  AlertTriangle,
  LayoutGrid,
  ListChecks,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Timeline } from "@/components/admin/Timeline";
import { FileUploader, UploadedFile } from "@/components/admin/FileUploader";
import { KpiCard } from "@/components/admin/KpiCard";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminRole } from "@/context/AdminRoleContext";
import {
  updateTripStatusAction,
  assignGuideAction,
  setChecklistItemAction,
  addTripUpdateAction,
  addTripFeedbackAction,
  addTaskAction,
  updateTaskStatusAction,
  toggleTaskSubItemAction,
  deleteTaskAction,
  applyTaskTemplateAction,
  validateCommunicationAction,
  cancelCommunicationAction,
  composeManualCommunicationAction,
  toggleCheckinAction,
  addTripPhotosAction,
  updateTripPhotoCaptionAction,
  removeTripPhotoAction,
} from "../actions";
import type { TripRow, TripTaskRow, TripReportRow } from "@/lib/server/trips";
import type { TaskTemplateRow } from "@/lib/server/task-templates";
import type { Tables } from "@/lib/server/types";

type TaskPhase = Tables<"trip_tasks">["phase"];
type TaskCategory = Tables<"trip_tasks">["category"];
type TaskStatus = Tables<"trip_tasks">["status"];
type TaskPriority = Tables<"trip_tasks">["priority"];
type CommChannel = Tables<"trip_communications">["channel"];
type TripCommunicationRow = Tables<"trip_communications">;
type ChecklistItem = { label: string; done: boolean };
type SubItem = { id: string; label: string; done: boolean };
type AdminProfileRow = Tables<"admin_profiles">;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}
function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function tripDays(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const days: Date[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
}

function checklist(p: Tables<"trip_participants">): ChecklistItem[] {
  return (p.checklist as ChecklistItem[] | null) ?? [];
}
function subItems(task: TripTaskRow): SubItem[] {
  return (task.sub_items as SubItem[] | null) ?? [];
}

const PHASES: TaskPhase[] = ["AVANT", "PENDANT", "APRES"];
const PHASE_LABELS: Record<TaskPhase, string> = { AVANT: "Avant le voyage", PENDANT: "Pendant le voyage", APRES: "Après le voyage" };
const CATEGORY_LABELS: Record<TaskCategory, string> = {
  LOGISTIQUE: "Logistique",
  FOURNISSEURS: "Fournisseurs",
  DOCUMENTS_CLIENT: "Documents client",
  COMMUNICATION: "Communication",
  FINANCE: "Finance",
};
const TASK_STATUSES: TaskStatus[] = ["A_FAIRE", "EN_COURS", "FAIT", "BLOQUE"];
const TASK_STATUS_LABELS: Record<TaskStatus, string> = { A_FAIRE: "À faire", EN_COURS: "En cours", FAIT: "Fait", BLOQUE: "Bloqué" };
const CHANNEL_LABELS: Record<CommChannel, string> = { EMAIL: "Email", SMS: "SMS", PUSH: "Push" };

function taskDisplayStatus(task: TripTaskRow): TaskStatus | "EN_RETARD" {
  if ((task.status === "A_FAIRE" || task.status === "EN_COURS") && new Date(task.due_date) < new Date()) {
    return "EN_RETARD";
  }
  return task.status;
}

function isAlertTask(task: TripTaskRow, trip: TripRow) {
  if (task.status === "FAIT" || trip.status !== "UPCOMING") return false;
  const critical = task.priority === "URGENTE" || task.category === "FINANCE" || task.category === "DOCUMENTS_CLIENT";
  if (!critical) return false;
  const soon = new Date();
  soon.setDate(soon.getDate() + 3);
  return new Date(task.due_date) <= soon;
}

function FriseStrip({ tasks, trip }: { tasks: TripTaskRow[]; trip: TripRow }) {
  if (tasks.length === 0) return null;
  const offsetOf = (task: TripTaskRow) => Math.round((new Date(task.due_date).getTime() - new Date(trip.start_date).getTime()) / 86400000);
  const offsets = tasks.map(offsetOf);
  const min = Math.min(...offsets, 0);
  const max = Math.max(...offsets, 0);
  const span = max - min || 1;
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <p className="text-xs font-semibold text-stone-500 mb-4 dark:text-stone-400">Frise des échéances (J0 = départ)</p>
      <div className="relative h-4">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-stone-200 dark:bg-stone-800" />
        <div className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-luxe-terracotta" style={{ left: `${((0 - min) / span) * 100}%` }} />
        {tasks.map((task) => {
          const offset = offsetOf(task);
          const display = taskDisplayStatus(task);
          const color = task.status === "FAIT" ? "bg-emerald-500" : display === "EN_RETARD" ? "bg-red-500" : "bg-stone-400";
          return (
            <span
              key={task.id}
              title={`${task.title} (${offset >= 0 ? `J+${offset}` : `J${offset}`})`}
              className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${color}`}
              style={{ left: `${((offset - min) / span) * 100}%` }}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-stone-400 mt-2 dark:text-stone-500">
        <span>J{min}</span>
        <span>Départ</span>
        <span>J+{max}</span>
      </div>
    </div>
  );
}

function TaskCard({ task, actor }: { task: TripTaskRow; actor: string }) {
  const router = useRouter();
  const display = taskDisplayStatus(task);
  const items = subItems(task);

  async function handleDelete() {
    await deleteTaskAction(task.trip_id, task.id);
    router.refresh();
  }
  async function handleSubItemToggle(subItemId: string, done: boolean) {
    await toggleTaskSubItemAction(task.trip_id, task.id, subItemId, done);
    router.refresh();
  }
  async function handleStatusChange(status: TaskStatus) {
    await updateTaskStatusAction(task.id, status, actor);
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3 space-y-2 dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{task.title}</p>
        <button type="button" onClick={handleDelete} className="shrink-0 text-stone-300 hover:text-red-500 dark:text-stone-700">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <StatusBadge status={task.category} label={CATEGORY_LABELS[task.category]} />
        {task.priority === "URGENTE" && <StatusBadge status="URGENTE" />}
        <StatusBadge status={display} />
      </div>
      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span>{formatDateShort(task.due_date)}</span>
        <span>{task.admin_profiles?.name ?? "—"}</span>
      </div>
      {items.length > 0 && (
        <div className="space-y-1 border-t border-stone-100 pt-2 dark:border-stone-800">
          {items.map((s) => (
            <label key={s.id} className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer dark:text-stone-400">
              <Checkbox checked={s.done} onCheckedChange={() => handleSubItemToggle(s.id, !s.done)} />
              <span className={s.done ? "line-through text-stone-400 dark:text-stone-500" : ""}>{s.label}</span>
            </label>
          ))}
        </div>
      )}
      {task.supplier_tag && (
        <p className="text-[11px] text-stone-400 dark:text-stone-500">Fournisseur : {task.supplier_tag}</p>
      )}
      <Select value={task.status} onValueChange={(v) => handleStatusChange(v as TaskStatus)}>
        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          {TASK_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{TASK_STATUS_LABELS[s]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const EMPTY_TASK_FORM = { title: "", phase: "AVANT" as TaskPhase, category: "LOGISTIQUE" as TaskCategory, dueDate: "", assigneeId: "", priority: "NORMALE" as TaskPriority, supplierTag: "" };

function AddTaskDialog({
  open,
  onOpenChange,
  tripId,
  actor,
  profiles,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  actor: string;
  profiles: AdminProfileRow[];
}) {
  const router = useRouter();
  const [form, setForm] = React.useState(EMPTY_TASK_FORM);

  React.useEffect(() => {
    if (open) setForm(EMPTY_TASK_FORM);
  }, [open]);

  function set<K extends keyof typeof EMPTY_TASK_FORM>(key: K, value: (typeof EMPTY_TASK_FORM)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const valid = form.title.trim().length > 0 && form.dueDate.length > 0;

  async function submit() {
    await addTaskAction(
      tripId,
      {
        title: form.title.trim(),
        phase: form.phase,
        category: form.category,
        due_date: new Date(form.dueDate).toISOString(),
        assignee_id: form.assigneeId || null,
        priority: form.priority,
        supplier_tag: form.supplierTag || null,
      },
      actor
    );
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Nouvelle tâche</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Titre</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex. Confirmer le transfert aéroport" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Phase</Label>
              <Select value={form.phase} onValueChange={(v) => set("phase", v as TaskPhase)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PHASES.map((p) => <SelectItem key={p} value={p}>{PHASE_LABELS[p]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Catégorie</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v as TaskCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CATEGORY_LABELS) as TaskCategory[]).map((c) => <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Échéance</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Priorité</Label>
              <Select value={form.priority} onValueChange={(v) => set("priority", v as TaskPriority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NORMALE">Normale</SelectItem>
                  <SelectItem value="URGENTE">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Assigné à</Label>
              <Select value={form.assigneeId || "NONE"} onValueChange={(v) => set("assigneeId", v === "NONE" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Aucun</SelectItem>
                  {profiles.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Fournisseur lié</Label>
              <Input value={form.supplierTag} onChange={(e) => set("supplierTag", e.target.value)} placeholder="Nom du fournisseur..." />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button disabled={!valid} onClick={submit}>Ajouter la tâche</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TasksTab({ trip, actor, profiles, templates }: { trip: TripRow; actor: string; profiles: AdminProfileRow[]; templates: TaskTemplateRow[] }) {
  const router = useRouter();
  const tasks = trip.trip_tasks;
  const [view, setView] = React.useState<"grouped" | "kanban">("grouped");
  const [phaseFilter, setPhaseFilter] = React.useState("ALL");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");
  const [assigneeFilter, setAssigneeFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [addOpen, setAddOpen] = React.useState(false);

  const assignees = React.useMemo(
    () => Array.from(new Set(tasks.map((t) => t.admin_profiles?.name).filter((n): n is string => Boolean(n)))),
    [tasks]
  );

  const filtered = React.useMemo(
    () =>
      tasks.filter((t) => {
        if (phaseFilter !== "ALL" && t.phase !== phaseFilter) return false;
        if (categoryFilter !== "ALL" && t.category !== categoryFilter) return false;
        if (assigneeFilter !== "ALL" && t.admin_profiles?.name !== assigneeFilter) return false;
        if (statusFilter !== "ALL" && taskDisplayStatus(t) !== statusFilter) return false;
        return true;
      }),
    [tasks, phaseFilter, categoryFilter, assigneeFilter, statusFilter]
  );

  const alertTasks = tasks.filter((t) => isAlertTask(t, trip));

  async function handleApplyTemplate(templateId: string) {
    await applyTaskTemplateAction(trip.id, templateId, trip.start_date, trip.status, actor);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {alertTasks.length > 0 && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">
              {alertTasks.length} tâche{alertTasks.length > 1 ? "s" : ""} critique{alertTasks.length > 1 ? "s" : ""} à traiter avant le départ
            </p>
            <p className="text-xs mt-0.5">{alertTasks.map((t) => t.title).join(", ")}</p>
          </div>
        </div>
      )}

      <FriseStrip tasks={tasks} trip={trip} />

      <div className="rounded-xl border border-stone-200 bg-white p-3 flex flex-wrap items-center gap-2 dark:border-stone-800 dark:bg-stone-900">
        <Select value={phaseFilter} onValueChange={setPhaseFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Phase" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes phases</SelectItem>
            {PHASES.map((p) => <SelectItem key={p} value={p}>{PHASE_LABELS[p]}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Catégorie" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes catégories</SelectItem>
            {(Object.keys(CATEGORY_LABELS) as TaskCategory[]).map((c) => <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Assigné" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous assignés</SelectItem>
            {assignees.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous statuts</SelectItem>
            {TASK_STATUSES.map((s) => <SelectItem key={s} value={s}>{TASK_STATUS_LABELS[s]}</SelectItem>)}
            <SelectItem value="EN_RETARD">En retard</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <div className="flex items-center rounded-lg border border-stone-200 p-0.5 dark:border-stone-800">
          <button type="button" onClick={() => setView("grouped")} className={`rounded-md p-1.5 ${view === "grouped" ? "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100" : "text-stone-400 dark:text-stone-500"}`}>
            <ListChecks className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setView("kanban")} className={`rounded-md p-1.5 ${view === "kanban" ? "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100" : "text-stone-400 dark:text-stone-500"}`}>
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="outline" size="sm">Appliquer un modèle</Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {templates.map((t) => (
              <DropdownMenuItem key={t.id} onSelect={() => handleApplyTemplate(t.id)}>{t.name}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Tâche
        </Button>
      </div>

      {view === "grouped" ? (
        <div className="space-y-6">
          {PHASES.map((phase) => {
            const phaseTasks = filtered.filter((t) => t.phase === phase);
            if (phaseTasks.length === 0) return null;
            const done = phaseTasks.filter((t) => t.status === "FAIT").length;
            return (
              <div key={phase} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300">{PHASE_LABELS[phase]}</h3>
                  <span className="text-xs text-stone-400 dark:text-stone-500">{done}/{phaseTasks.length}</span>
                </div>
                <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden dark:bg-stone-800">
                  <div className="h-full bg-luxe-terracotta" style={{ width: `${Math.round((done / phaseTasks.length) * 100)}%` }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {phaseTasks.map((task) => <TaskCard key={task.id} task={task} actor={actor} />)}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <p className="text-sm text-stone-400 py-8 text-center dark:text-stone-500">Aucune tâche ne correspond aux filtres.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TASK_STATUSES.map((status) => {
            const colTasks = filtered.filter((t) => t.status === status);
            return (
              <div key={status} className="space-y-2">
                <h3 className="text-sm font-bold text-stone-700 flex items-center justify-between dark:text-stone-300">
                  {TASK_STATUS_LABELS[status]}
                  <span className="text-xs font-normal text-stone-400 dark:text-stone-500">({colTasks.length})</span>
                </h3>
                <div className="space-y-2 min-h-[60px]">
                  {colTasks.map((task) => <TaskCard key={task.id} task={task} actor={actor} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddTaskDialog open={addOpen} onOpenChange={setAddOpen} tripId={trip.id} actor={actor} profiles={profiles} />
    </div>
  );
}

function ComposeForm({ trip, actor }: { trip: TripRow; actor: string }) {
  const router = useRouter();
  const [channel, setChannel] = React.useState<CommChannel>("EMAIL");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [audience, setAudience] = React.useState<"ALL" | "SELECTION">("ALL");
  const [selected, setSelected] = React.useState<string[]>([]);

  function toggleParticipant(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const valid = body.trim().length > 0 && (audience === "ALL" || selected.length > 0);

  async function submit() {
    await composeManualCommunicationAction(
      trip.id,
      {
        channel,
        subject: channel === "EMAIL" ? subject || null : null,
        body: body.trim(),
        recipient_participant_ids: audience === "ALL" ? [] : selected,
      },
      actor
    );
    setSubject("");
    setBody("");
    setAudience("ALL");
    setSelected([]);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-sm">Composer un message</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Canal</Label>
            <Select value={channel} onValueChange={(v) => setChannel(v as CommChannel)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(CHANNEL_LABELS) as CommChannel[]).map((c) => <SelectItem key={c} value={c}>{CHANNEL_LABELS[c]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Destinataires</Label>
            <Select value={audience} onValueChange={(v) => setAudience(v as "ALL" | "SELECTION")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les participants</SelectItem>
                <SelectItem value="SELECTION">Sélection de participants</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {audience === "SELECTION" && (
          <div className="flex flex-wrap gap-3 rounded-lg border border-stone-100 p-2 dark:border-stone-800">
            {trip.trip_participants.map((p) => (
              <label key={p.id} className="flex items-center gap-1.5 text-sm text-stone-700 cursor-pointer dark:text-stone-300">
                <Checkbox checked={selected.includes(p.id)} onCheckedChange={() => toggleParticipant(p.id)} />
                {p.name}
              </label>
            ))}
          </div>
        )}
        {channel === "EMAIL" && (
          <div className="space-y-1.5">
            <Label>Objet</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
        )}
        <div className="space-y-1.5">
          <Label>Message</Label>
          <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Votre message..." />
        </div>
        <Button disabled={!valid} onClick={submit}>
          <Send className="h-3.5 w-3.5" />
          Envoyer
        </Button>
      </CardContent>
    </Card>
  );
}

function CommunicationsTab({ trip, actor }: { trip: TripRow; actor: string }) {
  const router = useRouter();
  const communications = trip.trip_communications;
  const [rejectTarget, setRejectTarget] = React.useState<TripCommunicationRow | null>(null);

  const queue = communications.filter((c) => c.status === "EN_ATTENTE_VALIDATION");
  const history = [...communications].sort((a, b) => (b.sent_at ?? "").localeCompare(a.sent_at ?? ""));

  async function handleValidate(id: string) {
    await validateCommunicationAction(trip.id, id, actor);
    router.refresh();
  }
  async function handleReject() {
    if (!rejectTarget) return;
    await cancelCommunicationAction(trip.id, rejectTarget.id, actor);
    setRejectTarget(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {queue.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">File d&apos;attente de validation</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {queue.map((c) => (
              <div key={c.id} className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2 dark:border-amber-800 dark:bg-amber-900/20">
                <div className="flex items-center gap-2">
                  <StatusBadge status={c.channel} label={CHANNEL_LABELS[c.channel]} />
                  {c.subject && <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{c.subject}</span>}
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">{c.body}</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleValidate(c.id)}>
                    <Check className="h-3.5 w-3.5" />
                    Valider
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setRejectTarget(c)}>
                    <X className="h-3.5 w-3.5" />
                    Rejeter
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <ComposeForm trip={trip} actor={actor} />

      <Card>
        <CardHeader><CardTitle className="text-sm">Historique des communications</CardTitle></CardHeader>
        <CardContent>
          <Timeline
            items={history.map((c) => ({
              id: c.id,
              label: `${CHANNEL_LABELS[c.channel]}${c.subject ? ` — ${c.subject}` : ""} · ${
                c.status === "ENVOYEE" ? "envoyée" : c.status === "ANNULEE" ? "annulée" : c.status === "EN_ATTENTE_VALIDATION" ? "en attente" : "programmée"
              }`,
              detail: c.body,
              actor: c.created_by,
              date: c.sent_at ?? c.scheduled_at ?? new Date().toISOString(),
            }))}
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(rejectTarget)}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        title="Rejeter cette communication ?"
        destructive
        confirmLabel="Rejeter"
        onConfirm={handleReject}
      />
    </div>
  );
}

function ApresVoyageTab({ trip, actor, avgRating, report }: { trip: TripRow; actor: string; avgRating: string; report: TripReportRow | null }) {
  const router = useRouter();
  const photos = trip.trip_media.filter((m) => m.type === "PHOTO");
  const clientName = trip.bookings?.clients?.name ?? "";
  const [rating, setRating] = React.useState(5);
  const [author, setAuthor] = React.useState(clientName);
  const [comment, setComment] = React.useState("");
  const [newPhotos, setNewPhotos] = React.useState<UploadedFile[]>([]);

  const canSubmitFeedback = trip.status === "COMPLETED";

  async function submitFeedback() {
    if (!comment.trim()) return;
    await addTripFeedbackAction(trip.id, { author: author.trim() || clientName, rating, comment: comment.trim() }, actor);
    setComment("");
    setRating(5);
    router.refresh();
  }

  async function submitPhotos() {
    if (newPhotos.length === 0) return;
    await addTripPhotosAction(trip.id, newPhotos.map((f) => f.url), actor);
    setNewPhotos([]);
    router.refresh();
  }

  async function handleRemovePhoto(photoId: string) {
    await removeTripPhotoAction(trip.id, photoId);
    router.refresh();
  }

  async function handleCaptionBlur(photoId: string, value: string, current: string) {
    if (value !== current) {
      await updateTripPhotoCaptionAction(trip.id, photoId, value);
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <KpiCard label="Note moyenne" value={avgRating} icon={Star} helper={`${trip.trip_feedbacks.length} avis`} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Avis clients</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {trip.trip_feedbacks.length === 0 && <p className="text-sm text-stone-400 py-4 text-center dark:text-stone-500">Pas encore d&apos;avis — disponible une fois le voyage terminé.</p>}
            {trip.trip_feedbacks.map((f) => (
              <div key={f.id} className="rounded-lg border border-stone-100 p-3 dark:border-stone-800">
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < f.rating ? "fill-amber-400 text-amber-400" : "text-stone-200 dark:text-stone-700"}`} />
                  ))}
                </div>
                <p className="text-sm text-stone-700 dark:text-stone-300">{f.comment}</p>
                <p className="text-[11px] text-stone-400 mt-1 dark:text-stone-500">{f.author} · {formatDate(f.submitted_at)}</p>
              </div>
            ))}
            {canSubmitFeedback ? (
              <div className="space-y-2 border-t border-stone-100 pt-3 dark:border-stone-800">
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">Enregistrer un avis client</p>
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nom du client" />
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" onClick={() => setRating(i + 1)}>
                      <Star className={`h-5 w-5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-stone-200 dark:text-stone-700"}`} />
                    </button>
                  ))}
                </div>
                <Textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Retour du client..." />
                <Button size="sm" disabled={!comment.trim()} onClick={submitFeedback}>Enregistrer l&apos;avis</Button>
              </div>
            ) : (
              <p className="text-xs text-stone-400 border-t border-stone-100 pt-3 dark:text-stone-500 dark:border-stone-800">
                Le questionnaire de satisfaction est envoyé automatiquement à la clôture du voyage.
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Album photo souvenir</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <FileUploader files={newPhotos} onChange={setNewPhotos} label="Ajouter des photos" />
            <Button variant="outline" className="w-full" disabled={newPhotos.length === 0} onClick={submitPhotos}>
              <Plus className="h-3.5 w-3.5" />
              Ajouter {newPhotos.length > 0 ? `${newPhotos.length} photo${newPhotos.length > 1 ? "s" : ""}` : ""} à l&apos;album
            </Button>
            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-3 border-t border-stone-100 pt-3 dark:border-stone-800">
                {photos.map((p) => (
                  <div key={p.id} className="space-y-1">
                    <div className="group relative overflow-hidden rounded-lg border border-stone-200 dark:border-stone-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={p.caption ?? "Photo du voyage"} className="h-24 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(p.id)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <Input
                      className="h-7 text-xs"
                      placeholder="Légende..."
                      defaultValue={p.caption ?? ""}
                      onBlur={(e) => handleCaptionBlur(p.id, e.target.value, p.caption ?? "")}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Rapport de voyage</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {report ? (
              <StatusBadge status={report.status} label={report.status === "FINALIZED" ? "Finalisé" : "Brouillon"} />
            ) : (
              <p className="text-sm text-stone-400 dark:text-stone-500">
                {trip.status === "COMPLETED" ? "Pas encore généré." : "Disponible une fois le voyage clôturé."}
              </p>
            )}
          </div>
          <Button variant="outline" asChild={trip.status === "COMPLETED"} disabled={trip.status !== "COMPLETED"}>
            {trip.status === "COMPLETED" ? (
              <Link href={`/admin/voyages/${trip.id}/rapport`}>
                <FileDown className="h-3.5 w-3.5" />
                {report ? "Ouvrir le rapport de voyage" : "Générer le rapport de voyage"}
              </Link>
            ) : (
              <>
                <FileDown className="h-3.5 w-3.5" />
                Générer le rapport de voyage
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ParticipantsTab({ trip, days }: { trip: TripRow; days: Date[] }) {
  const router = useRouter();
  const checkinMap = new Map(trip.trip_checkins.map((c) => [`${c.participant_id}-${c.day}`, c.done]));

  async function handleToggleChecklist(participantId: string, label: string, done: boolean) {
    await setChecklistItemAction(trip.id, participantId, label, done);
    router.refresh();
  }
  async function handleToggleCheckin(participantId: string, day: number, done: boolean) {
    await toggleCheckinAction(trip.id, participantId, day, done);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-sm">Checklist avant-départ</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {trip.trip_participants.map((p) => (
            <div key={p.id} className="rounded-lg border border-stone-100 p-3 dark:border-stone-800">
              <p className="text-sm font-semibold text-stone-800 mb-2 dark:text-stone-100">{p.name}</p>
              <div className="space-y-1.5">
                {checklist(p).map((item) => (
                  <label key={item.label} className="flex items-center gap-2.5 text-sm text-stone-700 cursor-pointer dark:text-stone-300">
                    <Checkbox checked={item.done} onCheckedChange={() => handleToggleChecklist(p.id, item.label, !item.done)} />
                    <span className={item.done ? "line-through text-stone-400 dark:text-stone-500" : ""}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Participants & check-in journalier</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-left text-xs text-stone-400 dark:border-stone-800 dark:text-stone-500">
                <th className="py-2 pr-4">Participant</th>
                <th className="py-2 pr-4">Contact urgence</th>
                {days.map((d, i) => (
                  <th key={i} className="py-2 px-2 text-center whitespace-nowrap">J{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trip.trip_participants.map((p) => (
                <tr key={p.id} className="border-b border-stone-50 dark:border-stone-800">
                  <td className="py-2 pr-4 font-medium text-stone-800 dark:text-stone-100">{p.name}</td>
                  <td className="py-2 pr-4 text-stone-500 dark:text-stone-400">{p.emergency_contact ?? "—"}</td>
                  {days.map((_, i) => (
                    <td key={i} className="py-2 px-2 text-center">
                      <Checkbox checked={!!checkinMap.get(`${p.id}-${i}`)} onCheckedChange={() => handleToggleCheckin(p.id, i, !checkinMap.get(`${p.id}-${i}`))} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

export function TripDetailClient({
  trip,
  profiles,
  templates,
  report,
}: {
  trip: TripRow;
  profiles: AdminProfileRow[];
  templates: TaskTemplateRow[];
  report: TripReportRow | null;
}) {
  const router = useRouter();
  const { user } = useAdminRole();
  const guides = profiles.filter((p) => p.active && p.role === "GUIDE");

  const [updateText, setUpdateText] = React.useState("");
  const [updateMedia, setUpdateMedia] = React.useState<UploadedFile[]>([]);

  const days = tripDays(trip.start_date, trip.end_date);
  const avgRating = trip.trip_feedbacks.length > 0 ? (trip.trip_feedbacks.reduce((s, f) => s + f.rating, 0) / trip.trip_feedbacks.length).toFixed(1) : "—";
  const title = trip.bookings?.reference_label ?? "Voyage";
  const clientName = trip.bookings?.clients?.name ?? "—";

  async function handleSetStatus(status: "ONGOING" | "COMPLETED") {
    await updateTripStatusAction(trip.id, status, user.name);
    router.refresh();
  }
  async function handleAssignGuide(guideId: string, guideName: string) {
    await assignGuideAction(trip.id, guideId, guideName, user.name);
    router.refresh();
  }
  async function handlePublishUpdate() {
    await addTripUpdateAction(trip.id, updateText.trim(), updateMedia.map((f) => f.url), user.name);
    setUpdateText("");
    setUpdateMedia([]);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/voyages")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100">{title}</h1>
            <StatusBadge status={trip.status} />
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">{clientName} — {formatDate(trip.start_date)} au {formatDate(trip.end_date)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
        {trip.status === "UPCOMING" && (
          <Button size="sm" onClick={() => handleSetStatus("ONGOING")}>
            <PlayCircle className="h-3.5 w-3.5" />
            Démarrer le voyage
          </Button>
        )}
        {trip.status === "ONGOING" && (
          <Button size="sm" variant="destructive" onClick={() => handleSetStatus("COMPLETED")}>
            <StopCircle className="h-3.5 w-3.5" />
            Clôturer le voyage
          </Button>
        )}
        {trip.status === "COMPLETED" && (
          <Button size="sm" variant="outline" asChild>
            <Link href={`/admin/voyages/${trip.id}/rapport`}>
              <FileDown className="h-3.5 w-3.5" />
              Rapport de voyage
            </Link>
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">Assigner un guide {trip.admin_profiles?.name ? `(${trip.admin_profiles.name})` : ""}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {guides.map((g) => (
              <DropdownMenuItem key={g.id} onSelect={() => handleAssignGuide(g.id, g.name)}>{g.name}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="taches">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="taches">Tâches</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="suivi">Suivi live</TabsTrigger>
          <TabsTrigger value="apres">Après-voyage</TabsTrigger>
        </TabsList>

        <TabsContent value="taches">
          <TasksTab trip={trip} actor={user.name} profiles={profiles} templates={templates} />
        </TabsContent>

        <TabsContent value="communications">
          <CommunicationsTab trip={trip} actor={user.name} />
        </TabsContent>

        <TabsContent value="participants">
          <ParticipantsTab trip={trip} days={days} />
        </TabsContent>

        <TabsContent value="suivi">
          <Card>
            <CardHeader><CardTitle className="text-sm">Journal de suivi</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {trip.status === "UPCOMING" ? (
                <p className="text-sm text-stone-400 py-6 text-center dark:text-stone-500">Le suivi live sera disponible une fois le voyage démarré.</p>
              ) : (
                <>
                  <div className="space-y-2">
                    <Input placeholder="Publier une mise à jour (position, étape du jour...)" value={updateText} onChange={(e) => setUpdateText(e.target.value)} />
                    <FileUploader files={updateMedia} onChange={setUpdateMedia} label="Photos (optionnel)" />
                    <Button
                      disabled={!updateText.trim() || trip.status !== "ONGOING"}
                      onClick={handlePublishUpdate}
                    >
                      Publier
                    </Button>
                    {trip.status === "COMPLETED" && <p className="text-xs text-stone-400 dark:text-stone-500">Voyage terminé — publication désactivée.</p>}
                  </div>
                  <Timeline items={trip.trip_updates.map((u) => ({ id: u.id, label: u.message, actor: u.author, date: u.created_at }))} />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apres">
          <ApresVoyageTab trip={trip} actor={user.name} avgRating={avgRating} report={report} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
