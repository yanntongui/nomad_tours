import { createClient } from "@/lib/supabase/server";
import type { Json, Tables, TablesInsert, TablesUpdate } from "./types";

type TripClientRef = Pick<Tables<"clients">, "id" | "name">;
type TripBookingRef = Pick<Tables<"bookings">, "id" | "booking_number" | "reference_label" | "client_id"> & {
  clients: TripClientRef | null;
};
type TripGuideRef = Pick<Tables<"admin_profiles">, "id" | "name">;
type TripTaskAssigneeRef = Pick<Tables<"admin_profiles">, "id" | "name">;

export type TripTaskRow = Tables<"trip_tasks"> & {
  admin_profiles: TripTaskAssigneeRef | null;
};

export type TripRow = Tables<"trips"> & {
  bookings: TripBookingRef | null;
  admin_profiles: TripGuideRef | null;
  trip_participants: Tables<"trip_participants">[];
  trip_updates: Tables<"trip_updates">[];
  trip_feedbacks: Tables<"trip_feedbacks">[];
  trip_media: Tables<"trip_media">[];
  trip_tasks: TripTaskRow[];
  trip_communications: Tables<"trip_communications">[];
  trip_checkins: Tables<"trip_checkins">[];
  trip_timeline: Tables<"trip_timeline">[];
};

export type TripSummaryRow = Tables<"trips"> & {
  bookings: TripBookingRef | null;
  admin_profiles: TripGuideRef | null;
  trip_participants: Pick<Tables<"trip_participants">, "id" | "checklist">[];
  trip_tasks: TripTaskRow[];
  trip_communications: Tables<"trip_communications">[];
};

const TRIP_BOOKING_RELATION = "bookings(id,booking_number,reference_label,client_id,clients(id,name))";
const TRIP_GUIDE_RELATION = "admin_profiles(id,name)";
const TRIP_TASK_RELATION = "trip_tasks(*, admin_profiles(id,name))";
// Disambiguates against the indirect trips -> trip_checkins -> trip_participants path (PGRST201).
const TRIP_PARTICIPANTS_RELATION = "trip_participants!trip_participants_trip_id_fkey";

const WITH_RELATIONS = `*, ${TRIP_BOOKING_RELATION}, ${TRIP_GUIDE_RELATION}, ${TRIP_PARTICIPANTS_RELATION}(*), trip_updates(*), trip_feedbacks(*), trip_media(*), ${TRIP_TASK_RELATION}, trip_communications(*), trip_checkins(*), trip_timeline(*)`;

const SUMMARY_RELATIONS = `*, ${TRIP_BOOKING_RELATION}, ${TRIP_GUIDE_RELATION}, ${TRIP_PARTICIPANTS_RELATION}(id,checklist), ${TRIP_TASK_RELATION}, trip_communications(*)`;

export async function listTrips() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("start_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listTripsSummary() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select(SUMMARY_RELATIONS)
    .order("start_date", { ascending: false });
  if (error) throw error;
  return data as unknown as TripSummaryRow[];
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
  return data as unknown as TripRow | null;
}

export async function getActiveTripForCircuit(circuitId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select(`*, bookings!inner(id,booking_number,reference_label,reference_id,client_id,clients(id,name)), ${TRIP_GUIDE_RELATION}`)
    .eq("status", "ONGOING")
    .eq("bookings.reference_id", circuitId);
  if (error) throw error;
  const rows = (data as unknown as TripSummaryRow[]) ?? [];
  return rows[0] ?? null;
}

export type ActiveTripRiskRow = {
  id: string;
  bookings: { reference_id: string } | null;
  trip_participants: Pick<Tables<"trip_participants">, "checklist">[];
  trip_tasks: Pick<Tables<"trip_tasks">, "category" | "status" | "due_date">[];
};

export async function listOngoingTripsForRisk() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select(`id, bookings(reference_id), ${TRIP_PARTICIPANTS_RELATION}(checklist), trip_tasks(category,status,due_date)`)
    .eq("status", "ONGOING");
  if (error) throw error;
  return (data as unknown as ActiveTripRiskRow[]) ?? [];
}

export async function listTripFeedbacksForCircuit(circuitId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_feedbacks")
    .select("*, trips!inner(bookings!inner(reference_id))")
    .eq("trips.bookings.reference_id", circuitId);
  if (error) throw error;
  return data;
}

export async function listTripFeedbacksForClient(clientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_feedbacks")
    .select("*, trips!inner(bookings!inner(client_id))")
    .eq("trips.bookings.client_id", clientId);
  if (error) throw error;
  return data;
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
  actor: string | undefined,
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

export async function setParticipantChecklistItem(
  participantId: string,
  label: string,
  done: boolean,
) {
  const supabase = await createClient();
  const { data: participant, error: fetchError } = await supabase
    .from("trip_participants")
    .select("checklist")
    .eq("id", participantId)
    .single();
  if (fetchError) throw fetchError;
  const checklist = (participant.checklist as { label: string; done: boolean }[]) ?? [];
  const updated = checklist.map((c) => (c.label === label ? { ...c, done } : c));
  const { data, error } = await supabase
    .from("trip_participants")
    .update({ checklist: updated })
    .eq("id", participantId)
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

export async function updateTripMedia(id: string, patch: TablesUpdate<"trip_media">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_media")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTripMedia(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("trip_media").delete().eq("id", id);
  if (error) throw error;
}

export async function listTripTasks(tripId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_tasks")
    .select("*, admin_profiles(id,name)")
    .eq("trip_id", tripId);
  if (error) throw error;
  return data as unknown as TripTaskRow[];
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

export async function createTripTasks(
  tripId: string,
  tasks: Omit<TablesInsert<"trip_tasks">, "trip_id">[],
) {
  if (tasks.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_tasks")
    .insert(tasks.map((t) => ({ ...t, trip_id: tripId })))
    .select();
  if (error) throw error;
  return data;
}

/** Replaces every template-materialized task (and its comms) on a trip — mirrors trips-store.ts's applyTaskTemplate. */
export async function applyTripTaskTemplate(
  tripId: string,
  tasks: Omit<TablesInsert<"trip_tasks">, "trip_id">[],
  comms: (Omit<TablesInsert<"trip_communications">, "trip_id" | "task_id"> & { taskIndex: number })[],
) {
  const supabase = await createClient();
  const { data: oldTasks, error: oldTasksError } = await supabase
    .from("trip_tasks")
    .select("id")
    .eq("trip_id", tripId)
    .not("template_item_id", "is", null);
  if (oldTasksError) throw oldTasksError;
  const oldTaskIds = (oldTasks ?? []).map((t) => t.id);
  if (oldTaskIds.length > 0) {
    const { error: deleteCommsError } = await supabase
      .from("trip_communications")
      .delete()
      .in("task_id", oldTaskIds);
    if (deleteCommsError) throw deleteCommsError;
    const { error: deleteTasksError } = await supabase
      .from("trip_tasks")
      .delete()
      .in("id", oldTaskIds);
    if (deleteTasksError) throw deleteTasksError;
  }
  const { data: insertedTasks, error: insertTasksError } = await supabase
    .from("trip_tasks")
    .insert(tasks.map((t) => ({ ...t, trip_id: tripId })))
    .select();
  if (insertTasksError) throw insertTasksError;
  const commRows = comms
    .map(({ taskIndex, ...comm }) => ({ ...comm, trip_id: tripId, task_id: insertedTasks[taskIndex]?.id ?? null }))
    .filter((c) => c.task_id !== null);
  if (commRows.length > 0) {
    const { error: insertCommsError } = await supabase.from("trip_communications").insert(commRows);
    if (insertCommsError) throw insertCommsError;
  }
  return insertedTasks;
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

export async function getTripTask(taskId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_tasks")
    .select("*")
    .eq("id", taskId)
    .single();
  if (error) throw error;
  return data;
}

export async function setTripTaskSubItem(taskId: string, subItemId: string, done: boolean) {
  const task = await getTripTask(taskId);
  const subItems = (task.sub_items as { id: string; label: string; done: boolean }[] | null) ?? [];
  const updated = subItems.map((s) => (s.id === subItemId ? { ...s, done } : s));
  return updateTripTask(taskId, { sub_items: updated });
}

export async function deleteTripTask(taskId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("trip_tasks").delete().eq("id", taskId);
  if (error) throw error;
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

export async function scheduleTripCommunications(
  tripId: string,
  communications: Omit<TablesInsert<"trip_communications">, "trip_id">[],
) {
  if (communications.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_communications")
    .insert(communications.map((c) => ({ ...c, trip_id: tripId })))
    .select();
  if (error) throw error;
  return data;
}

export async function updateTripCommunication(
  id: string,
  patch: TablesUpdate<"trip_communications">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_communications")
    .update(patch)
    .eq("id", id)
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

// ---- Rapport de voyage ----

export type TripReportRow = Tables<"trip_reports"> & {
  trip_report_action_items: Tables<"trip_report_action_items">[];
};

export async function getTripReport(tripId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_reports")
    .select("*, trip_report_action_items(*)")
    .eq("trip_id", tripId)
    .maybeSingle();
  if (error) throw error;
  return data as TripReportRow | null;
}

export type TripReportListRow = TripReportRow & {
  trips: (Pick<Tables<"trips">, "id" | "start_date" | "end_date"> & {
    bookings: Pick<Tables<"bookings">, "reference_label"> | null;
    trip_feedbacks: Pick<Tables<"trip_feedbacks">, "rating">[];
  }) | null;
};

export async function listTripReports() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_reports")
    .select(
      "*, trip_report_action_items(*), trips(id, start_date, end_date, bookings(reference_label), trip_feedbacks(rating))",
    )
    .order("generated_at", { ascending: false });
  if (error) throw error;
  return data as unknown as TripReportListRow[];
}

export async function ensureTripReport(tripId: string, generatedBy: string) {
  const existing = await getTripReport(tripId);
  if (existing) return existing;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_reports")
    .insert({ trip_id: tripId, generated_by: generatedBy })
    .select("*, trip_report_action_items(*)")
    .single();
  if (error) throw error;
  return data as TripReportRow;
}

export async function updateTripReportManual(tripId: string, manual: Json) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_reports")
    .update({ manual, updated_at: new Date().toISOString() })
    .eq("trip_id", tripId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function finalizeTripReport(tripId: string, actor: string) {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("trip_reports")
    .update({ status: "FINALIZED", finalized_at: now, finalized_by: actor, updated_at: now })
    .eq("trip_id", tripId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addReportActionItems(reportId: string, labels: string[]) {
  const rows = labels.filter((l) => l.trim()).map((label) => ({ report_id: reportId, label: label.trim() }));
  if (rows.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("trip_report_action_items").insert(rows).select();
  if (error) throw error;
  return data;
}

export async function toggleReportActionItem(id: string, done: boolean) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_report_action_items")
    .update({ done })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
