"use client";
import { useSyncExternalStore } from "react";
import { TRIPS as INITIAL_TRIPS } from "@/lib/admin/mock/trips";
import { BOOKINGS } from "@/lib/admin/mock/bookings";
import { ADMIN_CIRCUITS } from "@/lib/admin/mock/circuits";
import { TASK_TEMPLATES } from "@/lib/admin/mock/task-templates";
import { COMMUNICATION_TEMPLATES } from "@/lib/admin/mock/communication-templates";
import {
  CommStatus,
  Trip,
  TripStatus,
  TripTask,
  TripTaskAttachment,
  TripCommunication,
  TripCheckin,
  TripTimelineEntry,
  TripPhoto,
  TripFeedback,
  TaskStatus,
  TaskTemplate,
} from "@/lib/admin/types";

const TODAY = new Date(2026, 7, 2);

interface State {
  trips: Trip[];
  tasks: TripTask[];
  communications: TripCommunication[];
  checkins: TripCheckin[];
  tripTimeline: TripTimelineEntry[];
  photos: TripPhoto[];
}

let seq = 1;
function nextId(prefix: string) {
  seq += 1;
  return `${prefix}-${seq}`;
}

function circuitThemeForTrip(trip: Trip) {
  const booking = BOOKINGS.find((b) => b.id === trip.bookingId);
  if (!booking) return undefined;
  const circuit = ADMIN_CIRCUITS.find((c) => c.id === booking.referenceId);
  return circuit?.theme;
}

function templateForTrip(trip: Trip): TaskTemplate | undefined {
  const theme = circuitThemeForTrip(trip);
  return TASK_TEMPLATES.find((t) => t.circuitTheme === theme) ?? TASK_TEMPLATES[0];
}

function seedTaskStatus(dueDate: Date): TaskStatus {
  const daysPast = Math.floor((TODAY.getTime() - dueDate.getTime()) / 86400000);
  if (daysPast > 3) return "FAIT";
  return "A_FAIRE";
}

function materializeTasksAndComms(trip: Trip, template: TaskTemplate): { tasks: TripTask[]; comms: TripCommunication[] } {
  const start = new Date(trip.startDate);
  const now = new Date().toISOString();
  const tasks: TripTask[] = [];
  const comms: TripCommunication[] = [];

  template.items.forEach((item) => {
    const due = new Date(start);
    due.setDate(due.getDate() + item.dueOffsetDays);
    const status = trip.status === "CANCELLED" ? "A_FAIRE" : seedTaskStatus(due);
    const taskId = nextId("task");
    const task: TripTask = {
      id: taskId,
      tripId: trip.id,
      templateItemId: item.id,
      title: item.title,
      phase: item.phase,
      category: item.category,
      dueDate: due.toISOString(),
      assigneeName: item.assigneeRole,
      status,
      priority: item.priority,
      subItems: item.subItems.map((label, i) => ({ id: `${taskId}-sub-${i}`, label, done: status === "FAIT" })),
      supplierTag: item.supplierTag,
      attachments: [],
      communicationTemplateId: item.communicationTemplateId,
      communicationTrigger: item.communicationTrigger,
      createdAt: now,
      updatedAt: now,
    };
    tasks.push(task);

    if (status === "FAIT" && item.communicationTemplateId && item.communicationTrigger && item.communicationTrigger !== "MANUEL") {
      const commTemplate = COMMUNICATION_TEMPLATES.find((c) => c.id === item.communicationTemplateId);
      if (commTemplate) {
        const commStatus: CommStatus = item.communicationTrigger === "AUTO" ? "ENVOYEE" : "EN_ATTENTE_VALIDATION";
        comms.push({
          id: nextId("comm"),
          tripId: trip.id,
          taskId,
          templateId: commTemplate.id,
          channel: commTemplate.channel,
          subject: commTemplate.subject,
          body: commTemplate.body,
          status: commStatus,
          sentAt: commStatus === "ENVOYEE" ? due.toISOString() : undefined,
          recipientParticipantIds: [],
          createdBy: "Système",
        });
      }
    }
  });

  return { tasks, comms };
}

function buildInitialState(): State {
  const trips = [...INITIAL_TRIPS];
  const tasks: TripTask[] = [];
  const communications: TripCommunication[] = [];
  trips.forEach((trip) => {
    const template = templateForTrip(trip);
    if (!template) return;
    const { tasks: t, comms } = materializeTasksAndComms(trip, template);
    tasks.push(...t);
    communications.push(...comms);
  });
  return { trips, tasks, communications, checkins: [], tripTimeline: [], photos: [] };
}

let state: State = buildInitialState();
const listeners = new Set<() => void>();
function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function logTimeline(tripId: string, label: string, detail: string | undefined, actor: string | undefined) {
  state.tripTimeline = [
    { id: nextId("tltl"), tripId, label, detail, actor, date: new Date().toISOString() },
    ...state.tripTimeline,
  ];
}

const SATISFACTION_SURVEY_LABEL = "Questionnaire de satisfaction envoyé";

function maybeTriggerSatisfactionSurvey(tripId: string) {
  const already = state.tripTimeline.some((e) => e.tripId === tripId && e.label === SATISFACTION_SURVEY_LABEL);
  if (already) return;
  logTimeline(tripId, SATISFACTION_SURVEY_LABEL, "Envoi automatique au client à la clôture du voyage", "Système");
}

export function useTripsStore() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export function useTrips() {
  return useSyncExternalStore(subscribe, () => state.trips, () => state.trips);
}

export function getTrip(id: string) {
  return state.trips.find((t) => t.id === id);
}

export function toggleChecklistItem(tripId: string, participantId: string, label: string) {
  state.trips = state.trips.map((t) =>
    t.id === tripId
      ? {
          ...t,
          participants: t.participants.map((p) =>
            p.id === participantId
              ? { ...p, checklist: p.checklist.map((c) => (c.label === label ? { ...c, done: !c.done } : c)) }
              : p
          ),
        }
      : t
  );
  emit();
}

export function addTripUpdate(tripId: string, message: string, mediaUrls: string[], actor: string) {
  state.trips = state.trips.map((t) =>
    t.id === tripId
      ? {
          ...t,
          updates: [
            { id: nextId("update"), tripId, author: actor, message, mediaUrls, createdAt: new Date().toISOString() },
            ...t.updates,
          ],
        }
      : t
  );
  logTimeline(tripId, "Mise à jour publiée", message.slice(0, 60), actor);
  emit();
}

export function assignGuide(tripId: string, guideId: string, guideName: string) {
  state.trips = state.trips.map((t) => (t.id === tripId ? { ...t, guideId, guideName } : t));
  logTimeline(tripId, "Guide assigné", guideName, undefined);
  emit();
}

export function setTripStatus(tripId: string, status: TripStatus) {
  state.trips = state.trips.map((t) => (t.id === tripId ? { ...t, status } : t));
  const labels: Record<TripStatus, string> = {
    UPCOMING: "Voyage remis à venir",
    ONGOING: "Voyage démarré",
    COMPLETED: "Voyage clôturé",
    CANCELLED: "Voyage annulé",
  };
  logTimeline(tripId, labels[status], undefined, undefined);
  if (status === "COMPLETED") maybeTriggerSatisfactionSurvey(tripId);
  emit();
}

// ---- Satisfaction ----

export function addTripFeedback(tripId: string, input: { author: string; rating: number; comment: string }, actor: string) {
  const feedback: TripFeedback = {
    id: nextId("feedback"),
    tripId,
    author: input.author,
    rating: input.rating,
    comment: input.comment,
    submittedAt: new Date().toISOString(),
  };
  state.trips = state.trips.map((t) => (t.id === tripId ? { ...t, feedbacks: [feedback, ...t.feedbacks] } : t));
  logTimeline(tripId, "Avis client enregistré", `${input.rating}/5 — ${input.comment.slice(0, 60)}`, actor);
  emit();
}

// ---- Tasks ----

export function useTripTasks(tripId?: string) {
  const s = useTripsStore();
  return tripId ? s.tasks.filter((t) => t.tripId === tripId) : s.tasks;
}

export function taskDisplayStatus(task: TripTask): TaskStatus | "EN_RETARD" {
  if ((task.status === "A_FAIRE" || task.status === "EN_COURS") && new Date(task.dueDate) < new Date()) {
    return "EN_RETARD";
  }
  return task.status;
}

function maybeTriggerCommunication(task: TripTask, actor: string) {
  if (!task.communicationTemplateId || !task.communicationTrigger || task.communicationTrigger === "MANUEL") return;
  const already = state.communications.find((c) => c.taskId === task.id);
  if (already) return;
  const commTemplate = COMMUNICATION_TEMPLATES.find((c) => c.id === task.communicationTemplateId);
  if (!commTemplate) return;
  const status: CommStatus = task.communicationTrigger === "AUTO" ? "ENVOYEE" : "EN_ATTENTE_VALIDATION";
  const comm: TripCommunication = {
    id: nextId("comm"),
    tripId: task.tripId,
    taskId: task.id,
    templateId: commTemplate.id,
    channel: commTemplate.channel,
    subject: commTemplate.subject,
    body: commTemplate.body,
    status,
    sentAt: status === "ENVOYEE" ? new Date().toISOString() : undefined,
    recipientParticipantIds: [],
    createdBy: actor,
  };
  state.communications = [comm, ...state.communications];
  logTimeline(
    task.tripId,
    status === "ENVOYEE" ? "Communication envoyée automatiquement" : "Communication en attente de validation",
    commTemplate.name,
    actor
  );
}

export function updateTaskStatus(taskId: string, status: TaskStatus, actor: string) {
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task) return;
  const updated: TripTask = { ...task, status, updatedAt: new Date().toISOString() };
  state.tasks = state.tasks.map((t) => (t.id === taskId ? updated : t));
  const labels: Record<TaskStatus, string> = {
    A_FAIRE: "Tâche remise à faire",
    EN_COURS: "Tâche en cours",
    FAIT: "Tâche terminée",
    BLOQUE: "Tâche bloquée",
  };
  logTimeline(task.tripId, labels[status], task.title, actor);
  if (status === "FAIT") maybeTriggerCommunication(updated, actor);
  emit();
}

export function updateTask(taskId: string, patch: Partial<TripTask>) {
  state.tasks = state.tasks.map((t) => (t.id === taskId ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t));
  emit();
}

export function toggleTaskSubItem(taskId: string, subItemId: string) {
  state.tasks = state.tasks.map((t) =>
    t.id === taskId
      ? { ...t, subItems: t.subItems.map((s) => (s.id === subItemId ? { ...s, done: !s.done } : s)) }
      : t
  );
  emit();
}

export function addTask(
  tripId: string,
  input: {
    title: string;
    phase: TripTask["phase"];
    category: TripTask["category"];
    dueDate: string;
    assigneeName?: string;
    priority: TripTask["priority"];
    supplierTag?: string;
  },
  actor: string
) {
  const now = new Date().toISOString();
  const task: TripTask = {
    id: nextId("task"),
    tripId,
    title: input.title,
    phase: input.phase,
    category: input.category,
    dueDate: input.dueDate,
    assigneeName: input.assigneeName,
    status: "A_FAIRE",
    priority: input.priority,
    subItems: [],
    supplierTag: input.supplierTag,
    attachments: [],
    createdAt: now,
    updatedAt: now,
  };
  state.tasks = [task, ...state.tasks];
  logTimeline(tripId, "Tâche ajoutée", input.title, actor);
  emit();
  return task;
}

export function addTaskAttachment(taskId: string, attachment: { name: string; url: string; isImage: boolean }) {
  const full: TripTaskAttachment = { id: nextId("att"), ...attachment };
  state.tasks = state.tasks.map((t) => (t.id === taskId ? { ...t, attachments: [...t.attachments, full] } : t));
  emit();
}

export function deleteTask(taskId: string) {
  state.tasks = state.tasks.filter((t) => t.id !== taskId);
  emit();
}

export function applyTaskTemplate(tripId: string, templateId: string, actor: string) {
  const trip = state.trips.find((t) => t.id === tripId);
  const template = TASK_TEMPLATES.find((t) => t.id === templateId);
  if (!trip || !template) return;
  state.tasks = state.tasks.filter((t) => t.tripId !== tripId || !t.templateItemId);
  state.communications = state.communications.filter((c) => {
    if (c.tripId !== tripId || !c.taskId) return true;
    return state.tasks.some((t) => t.id === c.taskId);
  });
  const { tasks, comms } = materializeTasksAndComms(trip, template);
  state.tasks = [...tasks, ...state.tasks];
  state.communications = [...comms, ...state.communications];
  logTimeline(tripId, "Modèle de tâches appliqué", template.name, actor);
  emit();
}

// ---- Communications ----

export function useTripCommunications(tripId?: string) {
  const s = useTripsStore();
  return tripId ? s.communications.filter((c) => c.tripId === tripId) : s.communications;
}

export function useCommunicationQueue() {
  const s = useTripsStore();
  return s.communications;
}

export function sendCommunication(id: string, actor: string) {
  const comm = state.communications.find((c) => c.id === id);
  if (!comm) return;
  state.communications = state.communications.map((c) => (c.id === id ? { ...c, status: "ENVOYEE", sentAt: new Date().toISOString() } : c));
  logTimeline(comm.tripId, "Communication envoyée", comm.subject ?? comm.body.slice(0, 60), actor);
  emit();
}

export function validateCommunication(id: string, actor: string) {
  const comm = state.communications.find((c) => c.id === id);
  if (!comm) return;
  state.communications = state.communications.map((c) => (c.id === id ? { ...c, status: "ENVOYEE", sentAt: new Date().toISOString() } : c));
  logTimeline(comm.tripId, "Communication validée et envoyée", comm.subject ?? comm.body.slice(0, 60), actor);
  emit();
}

export function cancelCommunication(id: string, actor: string) {
  const comm = state.communications.find((c) => c.id === id);
  if (!comm) return;
  state.communications = state.communications.map((c) => (c.id === id ? { ...c, status: "ANNULEE" } : c));
  logTimeline(comm.tripId, "Communication annulée", comm.subject ?? comm.body.slice(0, 60), actor);
  emit();
}

export function composeManualCommunication(
  tripId: string,
  payload: { channel: TripCommunication["channel"]; subject?: string; body: string; recipientParticipantIds: string[] },
  actor: string
) {
  const comm: TripCommunication = {
    id: nextId("comm"),
    tripId,
    channel: payload.channel,
    subject: payload.subject,
    body: payload.body,
    status: "ENVOYEE",
    sentAt: new Date().toISOString(),
    recipientParticipantIds: payload.recipientParticipantIds,
    createdBy: actor,
  };
  state.communications = [comm, ...state.communications];
  logTimeline(tripId, "Message manuel envoyé", payload.body.slice(0, 60), actor);
  emit();
  return comm;
}

// ---- Check-ins ----

export function useCheckins(tripId?: string) {
  const s = useTripsStore();
  return tripId ? s.checkins.filter((c) => c.tripId === tripId) : s.checkins;
}

export function toggleCheckin(tripId: string, participantId: string, day: number) {
  const existing = state.checkins.find((c) => c.tripId === tripId && c.participantId === participantId && c.day === day);
  if (existing) {
    state.checkins = state.checkins.map((c) => (c === existing ? { ...c, done: !c.done } : c));
  } else {
    state.checkins = [...state.checkins, { tripId, participantId, day, done: true }];
  }
  emit();
}

// ---- Timeline ----

export function useTripTimeline(tripId?: string) {
  const s = useTripsStore();
  return tripId ? s.tripTimeline.filter((e) => e.tripId === tripId) : s.tripTimeline;
}

// ---- Album photo souvenir ----

export function useTripPhotos(tripId?: string) {
  const s = useTripsStore();
  return tripId ? s.photos.filter((p) => p.tripId === tripId) : s.photos;
}

export function addTripPhotos(tripId: string, files: { url: string }[], actor: string) {
  const now = new Date().toISOString();
  const photos: TripPhoto[] = files.map((f) => ({
    id: nextId("photo"),
    tripId,
    url: f.url,
    uploadedBy: actor,
    createdAt: now,
  }));
  state.photos = [...photos, ...state.photos];
  logTimeline(tripId, `${photos.length} photo${photos.length > 1 ? "s" : ""} ajoutée${photos.length > 1 ? "s" : ""} à l'album`, undefined, actor);
  emit();
}

export function updateTripPhotoCaption(photoId: string, caption: string) {
  state.photos = state.photos.map((p) => (p.id === photoId ? { ...p, caption } : p));
  emit();
}

export function removeTripPhoto(photoId: string) {
  state.photos = state.photos.filter((p) => p.id !== photoId);
  emit();
}
