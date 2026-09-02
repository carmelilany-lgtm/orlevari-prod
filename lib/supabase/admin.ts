import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * SERVER-ONLY admin client (service role).
 *
 * - Bypasses RLS - use only for trusted server operations (bootstrap, cron, admin APIs).
 * - NEVER import this file from Client Components or any file with "use client".
 * - Do not expose SUPABASE_SERVICE_ROLE_KEY via NEXT_PUBLIC_*.
 */
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
