import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "./types";

export async function listCommunicationTemplates() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("communication_templates")
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
}

export async function getCommunicationTemplate(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("communication_templates")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createCommunicationTemplate(
  template: TablesInsert<"communication_templates">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("communication_templates")
    .insert(template)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCommunicationTemplate(
  id: string,
  patch: TablesUpdate<"communication_templates">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("communication_templates")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCommunicationTemplate(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("communication_templates")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
