import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

type VisaClientRef = Pick<Tables<"clients">, "id" | "name" | "email" | "phone">;
type VisaAgentRef = Pick<Tables<"admin_profiles">, "id" | "name">;

export type VisaRequestRow = Tables<"visa_requests"> & {
  visa_documents: Tables<"visa_documents">[];
  visa_timeline: Tables<"visa_timeline">[];
  clients: VisaClientRef | null;
  admin_profiles: VisaAgentRef | null;
};

export type VisaListRow = Tables<"visa_requests"> & {
  clients: VisaClientRef | null;
  admin_profiles: VisaAgentRef | null;
};

const LIST_RELATIONS = "*, clients(id,name,email,phone), admin_profiles(id,name)";
const WITH_RELATIONS =
  "*, visa_documents(*), visa_timeline(*), clients(id,name,email,phone), admin_profiles(id,name)";

export async function listVisaRequests() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_requests")
    .select(LIST_RELATIONS)
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return data as VisaListRow[];
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

const STATUS_LABELS: Record<Tables<"visa_requests">["status"], string> = {
  SUBMITTED: "Dossier soumis",
  PROCESSING: "Passé en traitement",
  APPROVED: "Visa approuvé",
  REJECTED: "Visa rejeté",
};

export async function advanceVisaStatus(
  id: string,
  status: Tables<"visa_requests">["status"],
  actor: string,
  note?: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_requests")
    .update({ status, ...(note !== undefined ? { admin_notes: note } : {}) })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  await logVisaTimeline(id, actor, STATUS_LABELS[status], note);
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
