import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

export type VisaRequestRow = Tables<"visa_requests"> & {
  visa_documents: Tables<"visa_documents">[];
  visa_timeline: Tables<"visa_timeline">[];
};

const WITH_RELATIONS = "*, visa_documents(*), visa_timeline(*)";

export async function listVisaRequests() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_requests")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listVisaRequestsForClient(clientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_requests")
    .select("*")
    .eq("client_id", clientId)
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getVisaRequest(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_requests")
    .select(WITH_RELATIONS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as VisaRequestRow | null;
}

export async function createVisaRequest(
  request: TablesInsert<"visa_requests">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_requests")
    .insert(request)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateVisaRequest(
  id: string,
  patch: TablesUpdate<"visa_requests">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_requests")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function advanceVisaStatus(
  id: string,
  status: Tables<"visa_requests">["status"],
  actor: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_requests")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  await logVisaTimeline(id, actor, `Statut changé: ${status}`);
  return data;
}

export async function logVisaTimeline(
  visaRequestId: string,
  actor: string,
  label: string,
  detail?: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_timeline")
    .insert({ visa_request_id: visaRequestId, actor, label, detail })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addVisaDocument(
  visaRequestId: string,
  document: Omit<TablesInsert<"visa_documents">, "visa_request_id">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_documents")
    .insert({ ...document, visa_request_id: visaRequestId })
    .select()
    .single();
  if (error) throw error;
  return data;
}
