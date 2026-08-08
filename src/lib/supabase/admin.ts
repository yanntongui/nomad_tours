import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Privileged Supabase client using the service_role key. Bypasses RLS
 * entirely — never expose this client or its key to the browser.
 *
 * Reserve for operations RLS genuinely cannot express (e.g. the
 * `on_auth_user_created` flow's follow-up admin actions, cross-tenant
 * aggregation, scheduled jobs). Everything else should go through
 * `createClient()` in `./server.ts` so RLS stays the source of truth.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
