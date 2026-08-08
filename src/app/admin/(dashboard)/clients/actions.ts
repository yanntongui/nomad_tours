"use server";

import { revalidatePath } from "next/cache";
import { updateClient, addClientNote } from "@/lib/server/clients";
import type { TablesUpdate } from "@/lib/server/types";

export async function updateClientAction(id: string, patch: TablesUpdate<"clients">) {
  try {
    const data = await updateClient(id, patch);
    revalidatePath(`/admin/clients/${id}`);
    revalidatePath("/admin/clients");
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function addClientNoteAction(clientId: string, author: string, content: string) {
  try {
    const data = await addClientNote(clientId, author, content);
    revalidatePath(`/admin/clients/${clientId}`);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}
