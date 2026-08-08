import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

type SupportClientRef = Pick<Tables<"clients">, "id" | "name" | "email" | "phone">;
type SupportAgentRef = Pick<Tables<"admin_profiles">, "id" | "name">;

export type SupportListRow = Tables<"support_tickets"> & {
  clients: SupportClientRef | null;
  admin_profiles: SupportAgentRef | null;
};

export type SupportTicketRow = Tables<"support_tickets"> & {
  ticket_messages: Tables<"ticket_messages">[];
  ticket_timeline: Tables<"ticket_timeline">[];
  clients: SupportClientRef | null;
  admin_profiles: SupportAgentRef | null;
};

const LIST_RELATIONS = "*, clients(id,name,email,phone), admin_profiles(id,name)";
const WITH_RELATIONS =
  "*, ticket_messages(*), ticket_timeline(*), clients(id,name,email,phone), admin_profiles(id,name)";

export async function listSupportTickets() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select(LIST_RELATIONS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as SupportListRow[];
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

const STATUS_LABELS: Record<Tables<"support_tickets">["status"], string> = {
  OUVERT: "Ticket ouvert",
  EN_COURS: "Passé en cours de traitement",
  RESOLU: "Marqué résolu",
  FERME: "Ticket clôturé",
  REJETE: "Réclamation rejetée",
};

export async function updateTicketStatus(
  id: string,
  status: Tables<"support_tickets">["status"],
  actor: string,
  reason?: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .update({ status, ...(reason !== undefined ? { admin_notes: reason } : {}) })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  await logTicketTimeline(id, actor, STATUS_LABELS[status], reason);
  return data;
}

export async function updateTicketPriority(
  id: string,
  priority: Tables<"support_tickets">["priority"],
  actor: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .update({ priority })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  await logTicketTimeline(id, actor, "Priorité modifiée", priority === "URGENTE" ? "Urgente" : "Normale");
  return data;
}

export async function addTicketNote(id: string, note: string, actor: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .update({ admin_notes: note })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  await logTicketTimeline(id, actor, "Note interne mise à jour", note);
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
