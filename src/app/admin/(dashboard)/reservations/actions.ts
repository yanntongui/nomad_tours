"use server";

import { revalidatePath } from "next/cache";
import {
  createBooking,
  updateBookingStatus,
  updateBooking,
  getBooking,
  logBookingTimeline,
  addBookingMessage,
  addBookingNote,
  addBookingDocument,
  addPayment,
} from "@/lib/server/bookings";
import type { Tables, TablesInsert } from "@/lib/server/types";

function revalidateBooking(id: string) {
  revalidatePath("/admin/reservations");
  revalidatePath(`/admin/reservations/${id}`);
  revalidatePath("/admin/paiements");
}

function generateBookingNumber() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(Math.random() * 9000) + 1000;
  return `NT-${year}-${suffix}`;
}

export async function createBookingAction(input: {
  client_id: string;
  agent_id: string;
  type: Tables<"bookings">["type"];
  reference_id: string;
  reference_label: string;
  destination_name: string;
  passengers: number;
  depart_date: string;
  total_price_xof: number;
  paid_xof: number;
  actor: string;
}) {
  try {
    const paymentStatus: Tables<"bookings">["payment_status"] =
      input.paid_xof >= input.total_price_xof && input.paid_xof > 0
        ? "PAID"
        : input.paid_xof > 0
          ? "PARTIAL"
          : "PENDING";
    const booking = await createBooking({
      booking_number: generateBookingNumber(),
      client_id: input.client_id,
      agent_id: input.agent_id,
      type: input.type,
      reference_id: input.reference_id,
      reference_label: input.reference_label,
      destination_name: input.destination_name,
      passengers: input.passengers,
      depart_date: input.depart_date,
      total_price_xof: input.total_price_xof,
      paid_xof: input.paid_xof,
      status: "PENDING",
      payment_status: paymentStatus,
    });
    await logBookingTimeline(booking.id, input.actor, "Réservation créée");
    revalidateBooking(booking.id);
    return { data: booking };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function updateBookingStatusAction(
  id: string,
  status: Tables<"bookings">["status"],
  actor: string,
  reason?: string,
) {
  try {
    const data = await updateBookingStatus(id, status, actor, reason);
    revalidateBooking(id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function toggleUrgentAction(id: string, currentUrgent: boolean, actor: string) {
  try {
    const data = await updateBooking(id, { urgent: !currentUrgent });
    await logBookingTimeline(id, actor, !currentUrgent ? "Marquée urgente" : "Urgence retirée");
    revalidateBooking(id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function reassignBookingAction(
  id: string,
  agentId: string,
  agentName: string,
  actor: string,
) {
  try {
    const data = await updateBooking(id, { agent_id: agentId });
    await logBookingTimeline(id, actor, "Réassignée", agentName);
    revalidateBooking(id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function duplicateBookingAction(id: string, actor: string) {
  try {
    const original = await getBooking(id);
    if (!original) return { error: "Réservation introuvable" };
    const copy = await createBooking({
      booking_number: generateBookingNumber(),
      client_id: original.client_id,
      agent_id: original.agent_id,
      type: original.type,
      reference_id: original.reference_id,
      reference_label: original.reference_label,
      destination_name: original.destination_name,
      passengers: original.passengers,
      depart_date: original.depart_date,
      total_price_xof: original.total_price_xof,
      paid_xof: 0,
      status: "PENDING",
      payment_status: "PENDING",
    });
    await logBookingTimeline(copy.id, actor, "Réservation créée par duplication", original.booking_number);
    revalidateBooking(copy.id);
    return { data: copy };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function addPaymentAction(
  bookingId: string,
  payment: Omit<TablesInsert<"payments">, "booking_id">,
  actor: string,
) {
  try {
    const data = await addPayment(bookingId, payment, actor);
    revalidateBooking(bookingId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function addNoteAction(bookingId: string, content: string, actor: string) {
  try {
    const data = await addBookingNote(bookingId, actor, content);
    revalidateBooking(bookingId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function addMessageAction(bookingId: string, content: string, actor: string) {
  try {
    const data = await addBookingMessage(bookingId, actor, content, false);
    revalidateBooking(bookingId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function addDocumentAction(
  bookingId: string,
  document: { name: string; type: string; url: string },
  actor: string,
) {
  try {
    const data = await addBookingDocument(bookingId, document);
    await logBookingTimeline(bookingId, actor, "Document ajouté", document.name);
    revalidateBooking(bookingId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}
