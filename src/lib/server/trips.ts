import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

export type TripRow = Tables<"trips"> & {
  trip_participants: Tables<"trip_participants">[];
  trip_updates: Tables<"trip_updates">[];
  trip_feedbacks: Tables<"trip_feedbacks">[];
  trip_media: Tables<"trip_media">[];
  trip_tasks: Tables<"trip_tasks">[];
  trip_communications: Tables<"trip_communications">[];
  trip_checkins: Tables<"trip_checkins">[];
  trip_timeline: Tables<"trip_timeline">[];
};

const WITH_RELATIONS =
  "*, trip_participants(*), trip_updates(*), trip_feedbacks(*), trip_media(*), trip_tasks(*), trip_communications(*), trip_checkins(*), trip_timeline(*)";

export async function listTrips() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("start_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listTripsByStatus(status: Tables<"trips">["status"]) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("status", status)
    .order("start_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getTrip(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select(WITH_RELATIONS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as TripRow | null;
}

export async function createTrip(trip: TablesInsert<"trips">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .insert(trip)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTrip(id: string, patch: TablesUpdate<"trips">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTripStatus(
  id: string,
  status: Tables<"trips">["status"],
  actor: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  await logTripTimeline(id, actor, `Statut changé: ${status}`);
  return data;
}

export async function logTripTimeline(
  tripId: string,
  actor: string,
  label: string,
  detail?: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_timeline")
    .insert({ trip_id: tripId, actor, label, detail })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addParticipant(
  tripId: string,
  participant: Omit<TablesInsert<"trip_participants">, "trip_id">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_participants")
    .insert({ ...participant, trip_id: tripId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addTripUpdate(
  tripId: string,
  update: Omit<TablesInsert<"trip_updates">, "trip_id">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_updates")
    .insert({ ...update, trip_id: tripId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addTripFeedback(
  tripId: string,
  feedback: Omit<TablesInsert<"trip_feedbacks">, "trip_id">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_feedbacks")
    .insert({ ...feedback, trip_id: tripId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addTripMedia(
  tripId: string,
  media: Omit<TablesInsert<"trip_media">, "trip_id">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_media")
    .insert({ ...media, trip_id: tripId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createTripTask(
  tripId: string,
  task: Omit<TablesInsert<"trip_tasks">, "trip_id">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_tasks")
    .insert({ ...task, trip_id: tripId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTripTaskStatus(
  taskId: string,
  status: Tables<"trip_tasks">["status"],
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_tasks")
    .update({ status })
    .eq("id", taskId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTripTask(
  taskId: string,
  patch: TablesUpdate<"trip_tasks">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_tasks")
    .update(patch)
    .eq("id", taskId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function scheduleTripCommunication(
  tripId: string,
  communication: Omit<TablesInsert<"trip_communications">, "trip_id">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_communications")
    .insert({ ...communication, trip_id: tripId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setCheckin(
  tripId: string,
  participantId: string,
  day: number,
  done: boolean,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_checkins")
    .upsert(
      { trip_id: tripId, participant_id: participantId, day, done },
      { onConflict: "trip_id,participant_id,day" },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}
