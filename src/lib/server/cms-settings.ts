import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesUpdate } from "./types";

export type CmsSeoSettingsRow = Tables<"cms_seo_settings">;

/** `cms_seo_settings` is a singleton row (id fixed to 1); public-readable, SUPER_ADMIN-writable. */
export async function getCmsSeoSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cms_seo_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data;
}

export async function updateCmsSeoSettings(
  patch: TablesUpdate<"cms_seo_settings">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cms_seo_settings")
    .update(patch)
    .eq("id", 1)
    .select()
    .single();
  if (error) throw error;
  return data;
}
