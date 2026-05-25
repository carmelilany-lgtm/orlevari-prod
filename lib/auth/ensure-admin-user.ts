import "server-only";

import { isEmailInAllowedList } from "@/lib/auth/is-admin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

/**
 * Sync allow-listed env emails into admin_users so RLS is_admin() works.
 * Called after successful login when email is in ADMIN_ALLOWED_EMAILS.
 */
export async function ensureAdminUserInDatabase(
  email: string,
): Promise<void> {
  const normalized = email.trim().toLowerCase();
  if (!isEmailInAllowedList(normalized)) {
    return;
  }

  const admin = createAdminSupabaseClient();
  if (!admin) {
    return;
  }

  const { error } = await admin.from("admin_users").upsert(
    { email: normalized },
    { onConflict: "email", ignoreDuplicates: false },
  );

  if (error) {
    console.error("[lev-ari] ensureAdminUserInDatabase:", error.message);
  }
}
