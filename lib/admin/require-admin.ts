import "server-only";

import { isCurrentUserAdmin } from "@/lib/auth/is-admin";
import type { ActionResult } from "@/lib/admin/action-result";
import { actionError } from "@/lib/admin/action-result";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export type AdminContext = {
  supabase: SupabaseClient<Database>;
  email: string;
  userId: string;
};

export async function requireAdmin(): Promise<AdminContext | ActionResult<never>> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return actionError(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user?.email) {
    return actionError("You must be signed in to perform this action.");
  }

  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    return actionError("Access denied. Your account is not authorized as an admin.");
  }

  return {
    supabase,
    email: user.email,
    userId: user.id,
  };
}
