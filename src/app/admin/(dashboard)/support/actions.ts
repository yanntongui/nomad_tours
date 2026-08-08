"use server";

import { revalidatePath } from "next/cache";
import {
  createSupportTicket,
  updateTicketStatus,
  updateTicketPriority,
  addTicketMessage,
  addTicketNote,
  updateSupportTicket,
  logTicketTimeline,
} from "@/lib/server/support";
import type { Tables } from "@/lib/server/types";

function revalidateSupport(id?: string) {
  revalidatePath("/admin/support");
  if (id) revalidatePath(`/admin/support/${id}`);
}

export async function createTicketAction(
  input: {
    clientId: string;
    clientName: string;
    type: Tables<"support_tickets">["type"];
    channel: Tables<"support_tickets">["channel"];
    subject: string;
    priority: Tables<"support_tickets">["priority"];
    message: string;
  },
  actor: string,
  agentId: string,
) {
  try {
    const ticket = await createSupportTicket({
      client_id: input.clientId,
      type: input.type,
      channel: input.channel,
      subject: input.subject,
      priority: input.priority,
      status: "OUVERT",
      agent_id: agentId,
    });
    await addTicketMessage(ticket.id, {
      author: input.clientName,
      from_client: true,
      channel: input.channel,
      content: input.message,
    });
    await logTicketTimeline(ticket.id, actor, "Ticket créé", input.subject);
    revalidateSupport(ticket.id);
    return { data: ticket };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function updateTicketStatusAction(
  id: string,
  status: Tables<"support_tickets">["status"],
  actor: string,
  reason?: string,
) {
  try {
    const data = await updateTicketStatus(id, status, actor, reason);
    revalidateSupport(id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function updateTicketPriorityAction(
  id: string,
  priority: Tables<"support_tickets">["priority"],
  actor: string,
) {
  try {
    const data = await updateTicketPriority(id, priority, actor);
    revalidateSupport(id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function addTicketMessageAction(
  id: string,
  content: string,
  channel: Tables<"support_tickets">["channel"],
  fromClient: boolean,
  actor: string,
) {
  try {
    const data = await addTicketMessage(id, { author: actor, from_client: fromClient, channel, content });
    await updateSupportTicket(id, { updated_at: new Date().toISOString() });
    await logTicketTimeline(id, actor, fromClient ? "Message reçu du client" : "Réponse envoyée", content.slice(0, 60));
    revalidateSupport(id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function addTicketNoteAction(id: string, note: string, actor: string) {
  try {
    const data = await addTicketNote(id, note, actor);
    revalidateSupport(id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}
