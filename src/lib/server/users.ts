import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "./types";

/**
 * The signed-in admin's own profile, or null if unauthenticated or the
 * `on_auth_user_created` row hasn't been created/activated yet. Intended to
 * replace `AdminRoleContext`'s dev-only role switcher once a login flow
 * exists — see docs/BACKEND.md.
 */
export async function getCurrentAdminProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** SUPER_ADMIN-only: full staff directory, see Utilisateurs & Rôles. */
export async function listAdminProfiles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
}

export async function getAdminProfile(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateAdminProfile(
  id: string,
  patch: TablesUpdate<"admin_profiles">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_profiles")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Deactivates a staff account without deleting it (keeps FK history on bookings/trips/etc. intact). */
export async function deactivateAdminProfile(id: string) {
  return updateAdminProfile(id, { active: false });
}
