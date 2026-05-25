import "server-only";

import { isCurrentUserAdmin } from "@/lib/auth/is-admin";
import type { ActionResult } from "@/lib/admin/action-result";
import { actionError } from "@/lib/admin/action-result";
import { adminErrors } from "@/lib/admin/copy";
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
    return actionError(adminErrors.supabaseNotConfigured);
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user?.email) {
    return actionError(adminErrors.notSignedIn);
  }

  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    return actionError(adminErrors.accessDenied);
  }

  return {
    supabase,
    email: user.email,
    userId: user.id,
  };
}
