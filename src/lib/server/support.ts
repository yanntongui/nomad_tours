import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

export type SupportTicketRow = Tables<"support_tickets"> & {
  ticket_messages: Tables<"ticket_messages">[];
  ticket_timeline: Tables<"ticket_timeline">[];
};

const WITH_RELATIONS = "*, ticket_messages(*), ticket_timeline(*)";

export async function listSupportTickets() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listSupportTicketsForClient(clientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getSupportTicket(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select(WITH_RELATIONS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as SupportTicketRow | null;
}

export async function createSupportTicket(
  ticket: TablesInsert<"support_tickets">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .insert(ticket)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSupportTicket(
  id: string,
  patch: TablesUpdate<"support_tickets">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTicketStatus(
  id: string,
  status: Tables<"support_tickets">["status"],
  actor: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  await logTicketTimeline(id, actor, `Statut changé: ${status}`);
  return data;
}

export async function logTicketTimeline(
  ticketId: string,
  actor: string | null,
  label: string,
  detail?: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ticket_timeline")
    .insert({ ticket_id: ticketId, actor, label, detail })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addTicketMessage(
  ticketId: string,
  message: Omit<TablesInsert<"ticket_messages">, "ticket_id">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ticket_messages")
    .insert({ ...message, ticket_id: ticketId })
    .select()
    .single();
  if (error) throw error;
  return data;
}
