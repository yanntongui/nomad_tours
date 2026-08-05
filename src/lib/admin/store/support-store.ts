"use client";
import { useSyncExternalStore } from "react";
import { SUPPORT_TICKETS as INITIAL_TICKETS, SUPPORT_MESSAGES as INITIAL_MESSAGES } from "@/lib/admin/mock/support";
import {
  ClientRef,
  SupportTicket,
  TicketChannel,
  TicketMessage,
  TicketPriority,
  TicketStatus,
  TicketTimelineEntry,
  TicketType,
} from "@/lib/admin/types";

interface State {
  tickets: SupportTicket[];
  messages: TicketMessage[];
  timeline: TicketTimelineEntry[];
}

let state: State = {
  tickets: [...INITIAL_TICKETS],
  messages: [...INITIAL_MESSAGES],
  timeline: [],
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

function logTimeline(ticketId: string, label: string, detail: string | undefined, actor: string | undefined) {
  state.timeline = [
    { id: nextId("ttl"), ticketId, label, detail, actor, createdAt: new Date().toISOString() },
    ...state.timeline,
  ];
}

export function useSupportStore() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export function getTicket(id: string) {
  return state.tickets.find((t) => t.id === id);
}

export function useTicketMessages(ticketId?: string) {
  const s = useSupportStore();
  return ticketId ? s.messages.filter((m) => m.ticketId === ticketId) : s.messages;
}

export function useTicketTimeline(ticketId?: string) {
  const s = useSupportStore();
  return ticketId ? s.timeline.filter((t) => t.ticketId === ticketId) : s.timeline;
}

const STATUS_LABELS: Record<TicketStatus, string> = {
  OUVERT: "Ticket ouvert",
  EN_COURS: "Passé en cours de traitement",
  RESOLU: "Marqué résolu",
  FERME: "Ticket clôturé",
  REJETE: "Réclamation rejetée",
};

export function createTicket(
  input: {
    client: ClientRef;
    type: TicketType;
    channel: TicketChannel;
    subject: string;
    priority: TicketPriority;
    message: string;
  },
  actor: string
) {
  const now = new Date().toISOString();
  const ticket: SupportTicket = {
    id: nextId("tkt"),
    client: input.client,
    type: input.type,
    channel: input.channel,
    subject: input.subject,
    status: "OUVERT",
    priority: input.priority,
    agent: actor,
    createdAt: now,
    updatedAt: now,
  };
  state.tickets = [ticket, ...state.tickets];
  state.messages = [
    ...state.messages,
    { id: nextId("tmsg"), ticketId: ticket.id, author: input.client.name, fromClient: true, channel: input.channel, content: input.message, createdAt: now },
  ];
  logTimeline(ticket.id, "Ticket créé", input.subject, actor);
  emit();
  return ticket;
}

export function updateTicketStatus(id: string, status: TicketStatus, actor: string, reason?: string) {
  state.tickets = state.tickets.map((t) =>
    t.id === id ? { ...t, status, adminNotes: reason ?? t.adminNotes, updatedAt: new Date().toISOString() } : t
  );
  logTimeline(id, STATUS_LABELS[status], reason, actor);
  emit();
}

export function updateTicketPriority(id: string, priority: TicketPriority, actor: string) {
  state.tickets = state.tickets.map((t) => (t.id === id ? { ...t, priority, updatedAt: new Date().toISOString() } : t));
  logTimeline(id, "Priorité modifiée", priority === "URGENTE" ? "Urgente" : "Normale", actor);
  emit();
}

export function addTicketMessage(ticketId: string, content: string, channel: TicketChannel, fromClient: boolean, actor: string) {
  const message: TicketMessage = {
    id: nextId("tmsg"),
    ticketId,
    author: actor,
    fromClient,
    channel,
    content,
    createdAt: new Date().toISOString(),
  };
  state.messages = [...state.messages, message];
  state.tickets = state.tickets.map((t) => (t.id === ticketId ? { ...t, updatedAt: message.createdAt } : t));
  logTimeline(ticketId, fromClient ? "Message reçu du client" : "Réponse envoyée", content.slice(0, 60), actor);
  emit();
  return message;
}

export function addTicketNote(id: string, note: string, actor: string) {
  state.tickets = state.tickets.map((t) => (t.id === id ? { ...t, adminNotes: note, updatedAt: new Date().toISOString() } : t));
  logTimeline(id, "Note interne mise à jour", note, actor);
  emit();
}
