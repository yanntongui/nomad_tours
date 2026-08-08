import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

export type EventRequestRow = Tables<"event_requests"> & {
  event_timeline: Tables<"event_timeline">[];
};

export async function listEventRequests() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_requests")
    .select("*")
    .order("event_date", { ascending: false });
  if (error) throw error;
  return data;
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
    .select("*, event_timeline(*)")
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

export async function advanceEventStatus(
  id: string,
  status: Tables<"event_requests">["status"],
  actor: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_requests")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  await logEventTimeline(id, actor, `Statut changé: ${status}`);
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
