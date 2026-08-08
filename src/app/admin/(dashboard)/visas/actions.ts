"use server";

import { revalidatePath } from "next/cache";
import {
  advanceVisaStatus,
  updateVisaRequest,
  logVisaTimeline,
  addVisaDocument,
  createVisaRequest,
} from "@/lib/server/visas";
import type { Tables, TablesInsert } from "@/lib/server/types";

function revalidateVisa(id: string) {
  revalidatePath("/admin/visas");
  revalidatePath(`/admin/visas/${id}`);
}

export async function createVisaRequestAction(
  request: TablesInsert<"visa_requests">,
  actor: string,
) {
  try {
    const data = await createVisaRequest(request);
    await logVisaTimeline(data.id, actor, "Demande de visa créée");
    revalidateVisa(data.id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function advanceVisaStatusAction(
  id: string,
  status: Tables<"visa_requests">["status"],
  actor: string,
  note?: string,
) {
  try {
    const data = await advanceVisaStatus(id, status, actor, note);
    revalidateVisa(id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function addVisaNoteAction(id: string, note: string, actor: string) {
  try {
    const data = await updateVisaRequest(id, { admin_notes: note });
    await logVisaTimeline(id, actor, "Note interne mise à jour", note);
    revalidateVisa(id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function addVisaDocumentAction(
  id: string,
  document: { name: string; url: string },
  actor: string,
) {
  try {
    const data = await addVisaDocument(id, document);
    await logVisaTimeline(id, actor, "Document ajouté", document.name);
    revalidateVisa(id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}
