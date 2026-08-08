import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

type EventClientRef = Pick<Tables<"clients">, "id" | "name" | "email" | "phone">;
type EventAgentRef = Pick<Tables<"admin_profiles">, "id" | "name">;

export type EventRequestRow = Tables<"event_requests"> & {
  event_timeline: Tables<"event_timeline">[];
  clients: EventClientRef | null;
  admin_profiles: EventAgentRef | null;
};

export type EventListRow = Tables<"event_requests"> & {
  clients: EventClientRef | null;
  admin_profiles: EventAgentRef | null;
};

const LIST_RELATIONS = "*, clients(id,name,email,phone), admin_profiles(id,name)";
const WITH_RELATIONS = "*, event_timeline(*), clients(id,name,email,phone), admin_profiles(id,name)";

export async function listEventRequests() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_requests")
    .select(LIST_RELATIONS)
    .order("event_date", { ascending: false });
  if (error) throw error;
  return data as EventListRow[];
}

export async function listEventRequestsForClient(clientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_requests")
    .select("*")
    .eq("client_id", clientId)
    .order("event_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getEventRequest(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_requests")
    .select(WITH_RELATIONS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as EventRequestRow | null;
}

export async function createEventRequest(
  request: TablesInsert<"event_requests">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_requests")
    .insert(request)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEventRequest(
  id: string,
  patch: TablesUpdate<"event_requests">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_requests")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

const STATUS_LABELS: Record<Tables<"event_requests">["status"], string> = {
  DRAFT: "Repassé en brouillon",
  REQUESTED: "Demande confirmée par le client",
  QUOTED: "Devis envoyé",
  CONFIRMED: "Événement confirmé",
  IN_PROGRESS: "Événement en cours",
  COMPLETED: "Événement terminé",
  CANCELLED: "Événement annulé",
};

export async function advanceEventStatus(
  id: string,
  status: Tables<"event_requests">["status"],
  actor: string,
  reason?: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_requests")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  await logEventTimeline(id, actor, STATUS_LABELS[status], reason);
  return data;
}

export async function logEventTimeline(
  eventRequestId: string,
  actor: string,
  label: string,
  detail?: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_timeline")
    .insert({ event_request_id: eventRequestId, actor, label, detail })
    .select()
    .single();
  if (error) throw error;
  return data;
}
