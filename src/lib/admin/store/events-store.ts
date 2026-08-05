"use client";
import { useSyncExternalStore } from "react";
import { EVENT_REQUESTS as INITIAL_REQUESTS, EVENT_TIMELINE as INITIAL_TIMELINE } from "@/lib/admin/mock/events";
import { ClientRef, EventRequest, EventStatus, EventTimelineEntry } from "@/lib/admin/types";

interface State {
  requests: EventRequest[];
  timeline: EventTimelineEntry[];
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

function logTimeline(eventRequestId: string, label: string, detail: string | undefined, actor: string) {
  state.timeline = [
    { id: nextId("evtl"), eventRequestId, label, detail, actor, createdAt: new Date().toISOString() },
    ...state.timeline,
  ];
}

export function useEventsStore() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );
}

export function getEventRequest(id: string) {
  return state.requests.find((e) => e.id === id);
}

const STATUS_LABELS: Record<EventStatus, string> = {
  DRAFT: "Repassé en brouillon",
  REQUESTED: "Demande confirmée par le client",
  QUOTED: "Devis envoyé",
  CONFIRMED: "Événement confirmé",
  IN_PROGRESS: "Événement en cours",
  COMPLETED: "Événement terminé",
  CANCELLED: "Événement annulé",
};

export function updateEventStatus(id: string, status: EventStatus, actor: string, reason?: string) {
  state.requests = state.requests.map((e) =>
    e.id === id ? { ...e, status, updatedAt: new Date().toISOString() } : e
  );
  logTimeline(id, STATUS_LABELS[status], reason, actor);
  emit();
}

export function setQuoteAmount(id: string, amountXOF: number, actor: string) {
  state.requests = state.requests.map((e) =>
    e.id === id ? { ...e, quoteAmountXOF: amountXOF, updatedAt: new Date().toISOString() } : e
  );
  logTimeline(id, "Devis mis à jour", `${amountXOF.toLocaleString("fr-FR")} FCFA`, actor);
  emit();
}

export function setEventServices(id: string, services: string[], actor: string) {
  state.requests = state.requests.map((e) => (e.id === id ? { ...e, services, updatedAt: new Date().toISOString() } : e));
  emit();
}

export function addEventNote(id: string, note: string, actor: string) {
  logTimeline(id, "Note interne", note, actor);
  emit();
}

export function createEventRequest(
  input: {
    client: ClientRef;
    type: string;
    guestCount: number;
    budgetXOF: number;
    eventDate: string;
    location?: string;
    agent: string;
  },
  actor: string
): EventRequest {
  const now = new Date().toISOString();
  const request: EventRequest = {
    id: nextId("evt"),
    client: input.client,
    type: input.type,
    guestCount: input.guestCount,
    budgetXOF: input.budgetXOF,
    services: [],
    eventDate: input.eventDate,
    location: input.location,
    status: "REQUESTED",
    agent: input.agent,
    createdAt: now,
    updatedAt: now,
  };
  state.requests = [request, ...state.requests];
  logTimeline(request.id, "Demande créée", `${input.type} — ${input.guestCount} invités`, actor);
  emit();
  return request;
}
