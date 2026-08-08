import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";
import type { HomepageContent } from "@/lib/admin/types";

export type HomepageContentRow = Tables<"homepage_content">;
export type HomepageContentVersionRow = Tables<"homepage_content_versions">;

/** Maps the DB row (mixed-case top-level columns, camelCase JSON inside) to the domain `HomepageContent` shape used by the editor form. */
export function rowToHomepageContent(row: HomepageContentRow): HomepageContent {
  return {
    hero: row.hero as unknown as HomepageContent["hero"],
    stats: row.stats as unknown as HomepageContent["stats"],
    services: row.services as unknown as HomepageContent["services"],
    whyUs: row.why_us as unknown as HomepageContent["whyUs"],
    featuredCircuit: row.featured_circuit as unknown as HomepageContent["featuredCircuit"],
    newsletter: row.newsletter as unknown as HomepageContent["newsletter"],
    footer: row.footer as unknown as HomepageContent["footer"],
    sectionsOrder: row.sections_order as unknown as HomepageContent["sectionsOrder"],
    featuredDestinations: row.featured_destinations as unknown as HomepageContent["featuredDestinations"],
    testimonialsConfig: row.testimonials_config as unknown as HomepageContent["testimonialsConfig"],
  };
}

/** `homepage_content` is a singleton row (id fixed to 1) holding CMS-editable JSONB sections; public-readable, SUPER_ADMIN-writable. */
export async function getHomepageContent() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_content")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data;
}

export async function updateHomepageContent(
  patch: TablesUpdate<"homepage_content">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_content")
    .update(patch)
    .eq("id", 1)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** `homepage_content_versions` holds a full draft/publish history for the HomepageEditorForm rollback UI; SUPER_ADMIN-only. */
export async function listHomepageVersions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_content_versions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getHomepageVersion(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_content_versions")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createHomepageVersion(
  version: TablesInsert<"homepage_content_versions">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_content_versions")
    .insert(version)
    .select()
    .single();
  if (error) throw error;
  return data;
}
