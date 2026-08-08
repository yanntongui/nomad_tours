"use client";
import { useSyncExternalStore } from "react";
import {
  BOOKINGS as INITIAL_BOOKINGS,
  PAYMENTS as INITIAL_PAYMENTS,
  PAYMENT_SCHEDULES as INITIAL_SCHEDULES,
  TIMELINE as INITIAL_TIMELINE,
  MESSAGES as INITIAL_MESSAGES,
  INTERNAL_NOTES as INITIAL_NOTES,
  DOCUMENTS as INITIAL_DOCUMENTS,
} from "@/lib/admin/mock/bookings";
import { pushNotification } from "@/lib/admin/store/notifications-store";
import {
  Booking,
  BookingDocument,
  InternalNote,
  Message,
  Payment,
  PaymentSchedule,
  TimelineEntry,
} from "@/lib/admin/types";

interface State {
  bookings: Booking[];
  payments: Payment[];
  schedules: PaymentSchedule[];
  timeline: TimelineEntry[];
  messages: Message[];
  notes: InternalNote[];
  documents: BookingDocument[];
}

let state: State = {
  bookings: [...INITIAL_BOOKINGS],
  payments: [...INITIAL_PAYMENTS],
  schedules: [...INITIAL_SCHEDULES],
  timeline: [...INITIAL_TIMELINE],
  messages: [...INITIAL_MESSAGES],
  notes: [...INITIAL_NOTES],
  documents: [...INITIAL_DOCUMENTS],
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

function logTimeline(bookingId: string, label: string, detail: string | undefined, actor: string) {
  state.timeline = [
    { id: nextId("tl"), bookingId, label, detail, actor, createdAt: new Date().toISOString() },
    ...state.timeline,
  ];
}

export function useBookingsStore() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );
}

export function getBooking(id: string) {
  return state.bookings.find((b) => b.id === id);
}

export function getBookingPayments(bookingId: string): Payment[] {
  return state.payments.filter((p) => p.bookingId === bookingId);
}

export function addBooking(booking: Booking, actor: string) {
  state.bookings = [booking, ...state.bookings];
  logTimeline(booking.id, "Réservation créée", `Réservation ${booking.bookingNumber} — ${booking.referenceLabel}`, actor);
  pushNotification({
    title: "Nouvelle réservation",
    description: `${booking.bookingNumber} — ${booking.referenceLabel}`,
    href: `/admin/reservations/${booking.id}`,
  });
  emit();
}

export function updateBookingStatus(id: string, status: Booking["status"], actor: string, reason?: string) {
  state.bookings = state.bookings.map((b) => (b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b));
  const labels: Record<Booking["status"], string> = {
    PENDING: "Réservation remise en attente",
    CONFIRMED: "Réservation confirmée",
    CANCELLED: "Réservation annulée",
    COMPLETED: "Réservation marquée terminée",
  };
  logTimeline(id, labels[status], reason, actor);
  emit();
}

export function toggleUrgent(id: string, actor: string) {
  state.bookings = state.bookings.map((b) => (b.id === id ? { ...b, urgent: !b.urgent } : b));
  const booking = state.bookings.find((b) => b.id === id);
  logTimeline(id, booking?.urgent ? "Marquée urgente" : "Retirée des urgences", undefined, actor);
  if (booking?.urgent) {
    pushNotification({
      title: "Réservation marquée urgente",
      description: booking.referenceLabel,
      href: `/admin/reservations/${id}`,
    });
  }
  emit();
}

export function reassignBooking(id: string, agentName: string, actor: string) {
  state.bookings = state.bookings.map((b) => (b.id === id ? { ...b, agent: agentName } : b));
  logTimeline(id, "Réassignée", `Nouvel agent : ${agentName}`, actor);
  emit();
}

export function duplicateBooking(id: string, actor: string): Booking | undefined {
  const original = state.bookings.find((b) => b.id === id);
  if (!original) return undefined;
  const copy: Booking = {
    ...original,
    id: nextId("bk"),
    bookingNumber: `NT-2026-${String(1000 + state.bookings.length).slice(-4)}`,
    status: "PENDING",
    paymentStatus: "PENDING",
    paidXOF: 0,
    urgent: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  state.bookings = [copy, ...state.bookings];
  logTimeline(copy.id, "Réservation créée", `Dupliquée depuis ${original.bookingNumber}`, actor);
  emit();
  return copy;
}

export function addPayment(payment: Omit<Payment, "id" | "createdAt">, actor: string) {
  const full: Payment = { ...payment, id: nextId("pay"), createdAt: new Date().toISOString() };
  state.payments = [full, ...state.payments];
  const booking = state.bookings.find((b) => b.id === payment.bookingId);
  if (booking) {
    const paidXOF = booking.paidXOF + payment.amountXOF;
    const paymentStatus = paidXOF >= booking.totalPriceXOF ? "PAID" : paidXOF > 0 ? "PARTIAL" : "PENDING";
    state.bookings = state.bookings.map((b) => (b.id === booking.id ? { ...b, paidXOF, paymentStatus } : b));
  }
  logTimeline(payment.bookingId, "Paiement enregistré", `${payment.amountXOF.toLocaleString("fr-FR")} FCFA via ${payment.method}`, actor);
  emit();
}

export function addNote(bookingId: string, content: string, actor: string) {
  state.notes = [{ id: nextId("note"), bookingId, author: actor, content, createdAt: new Date().toISOString() }, ...state.notes];
  emit();
}

export function addMessage(bookingId: string, content: string, actor: string) {
  state.messages = [...state.messages, { id: nextId("msg"), bookingId, author: actor, fromClient: false, content, createdAt: new Date().toISOString() }];
  logTimeline(bookingId, "Message envoyé au client", content.slice(0, 60), actor);
  emit();
}

export function addDocument(bookingId: string, doc: { name: string; type: string; url: string }, actor: string) {
  state.documents = [
    { id: nextId("doc"), bookingId, name: doc.name, type: doc.type, url: doc.url, uploadedAt: new Date().toISOString() },
    ...state.documents,
  ];
  logTimeline(bookingId, "Document ajouté", doc.name, actor);
  emit();
}
