"use server";

import { revalidatePath } from "next/cache";
import { advanceEventStatus, updateEventRequest, logEventTimeline, createEventRequest } from "@/lib/server/events";
import type { Tables, TablesInsert } from "@/lib/server/types";

function revalidateEvent(id: string) {
  revalidatePath("/admin/evenementiel");
  revalidatePath(`/admin/evenementiel/${id}`);
}

export async function createEventRequestAction(
  request: TablesInsert<"event_requests">,
  actor: string,
) {
  try {
    const data = await createEventRequest(request);
    await logEventTimeline(data.id, actor, "Demande événementielle créée");
    revalidateEvent(data.id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function advanceEventStatusAction(
  id: string,
  status: Tables<"event_requests">["status"],
  actor: string,
  reason?: string,
) {
  try {
    const data = await advanceEventStatus(id, status, actor, reason);
    revalidateEvent(id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function setQuoteAmountAction(id: string, amountXOF: number, actor: string) {
  try {
    const data = await updateEventRequest(id, { quote_amount_xof: amountXOF });
    await logEventTimeline(id, actor, "Devis mis à jour", `${amountXOF.toLocaleString("fr-FR")} FCFA`);
    revalidateEvent(id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function setEventServicesAction(id: string, services: string[]) {
  try {
    const data = await updateEventRequest(id, { services });
    revalidateEvent(id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function addEventNoteAction(id: string, note: string, actor: string) {
  try {
    await logEventTimeline(id, actor, "Note interne", note);
    revalidateEvent(id);
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}
