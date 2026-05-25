import "server-only";

import { redirect } from "next/navigation";
import { ensureAdminUserInDatabase } from "@/lib/auth/ensure-admin-user";
import { isCurrentUserAdmin } from "@/lib/auth/is-admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminSession = {
  email: string;
  configured: boolean;
};

/**
 * Server-side guard for protected admin pages.
 * Redirects to login when unauthenticated or not admin.
 */
export async function requireAdminPage(): Promise<AdminSession> {
  const configured = isSupabaseConfigured();

  if (!configured) {
    return { email: "", configured: false };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { email: "", configured: false };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/admin/login");
  }

  await ensureAdminUserInDatabase(user.email);

  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=access_denied");
  }

  return { email: user.email, configured: true };
}
