import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesUpdate } from "./types";

export type AgencySettingsRow = Tables<"agency_settings">;

/** `agency_settings` is a singleton row (id fixed to 1) — SUPER_ADMIN-only, see Paramètres. */
export async function getAgencySettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agency_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data;
}

export async function updateAgencySettings(patch: TablesUpdate<"agency_settings">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agency_settings")
    .update(patch)
    .eq("id", 1)
    .select()
    .single();
  if (error) throw error;
  return data;
}
