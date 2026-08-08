"use client";
import { useSyncExternalStore } from "react";
import { VISA_REQUESTS as INITIAL_REQUESTS, VISA_TIMELINE as INITIAL_TIMELINE } from "@/lib/admin/mock/visas";
import { pushNotification } from "@/lib/admin/store/notifications-store";
import { ClientRef, VisaDocument, VisaRequest, VisaStatus, VisaTimelineEntry } from "@/lib/admin/types";

interface State {
  requests: VisaRequest[];
  timeline: VisaTimelineEntry[];
}

let state: State = {
  requests: [...INITIAL_REQUESTS],
  timeline: [...INITIAL_TIMELINE],
};

const listeners = new Set<() => void>();
function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

let seq = 1000;
function nextId(prefix: string) {
  seq += 1;
  return `${prefix}-${seq}`;
}

function logTimeline(visaRequestId: string, label: string, detail: string | undefined, actor: string) {
  state.timeline = [
    { id: nextId("vtl"), visaRequestId, label, detail, actor, createdAt: new Date().toISOString() },
    ...state.timeline,
  ];
}

export function useVisasStore() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );
}

export function getVisaRequest(id: string) {
  return state.requests.find((v) => v.id === id);
}

const STATUS_LABELS: Record<VisaStatus, string> = {
  SUBMITTED: "Dossier soumis",
  PROCESSING: "Passé en traitement",
  APPROVED: "Visa approuvé",
  REJECTED: "Visa rejeté",
};

export function updateVisaStatus(id: string, status: VisaStatus, actor: string, note?: string) {
  state.requests = state.requests.map((v) =>
    v.id === id
      ? { ...v, status, adminNotes: note ?? v.adminNotes, updatedAt: new Date().toISOString() }
      : v
  );
  logTimeline(id, STATUS_LABELS[status], note, actor);
  emit();
}

export function addVisaNote(id: string, note: string, actor: string) {
  state.requests = state.requests.map((v) => (v.id === id ? { ...v, adminNotes: note, updatedAt: new Date().toISOString() } : v));
  logTimeline(id, "Note interne mise à jour", note, actor);
  emit();
}

export function addVisaDocument(id: string, doc: VisaDocument, actor: string) {
  state.requests = state.requests.map((v) => (v.id === id ? { ...v, documents: [...v.documents, doc] } : v));
  logTimeline(id, "Document ajouté", doc.name, actor);
  emit();
}

export function createVisaRequest(
  input: { client: ClientRef; country: string; feeXOF: number; agent: string },
  actor: string
): VisaRequest {
  const now = new Date().toISOString();
  const request: VisaRequest = {
    id: nextId("visa"),
    client: input.client,
    country: input.country,
    documents: [],
    status: "SUBMITTED",
    feeXOF: input.feeXOF,
    agent: input.agent,
    submittedAt: now,
    updatedAt: now,
  };
  state.requests = [request, ...state.requests];
  logTimeline(request.id, "Dossier soumis", `Demande de visa ${input.country}`, actor);
  pushNotification({
    title: "Nouvelle demande de visa",
    description: `${input.client.name} — ${input.country}`,
    href: `/admin/visas/${request.id}`,
  });
  emit();
  return request;
}
