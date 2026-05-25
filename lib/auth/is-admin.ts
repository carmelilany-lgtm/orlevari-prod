import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Comma-separated emails from env (bootstrap / fallback before admin_users sync).
 */
export function getAllowedAdminEmails(): string[] {
  const raw = process.env.ADMIN_ALLOWED_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailInAllowedList(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return getAllowedAdminEmails().includes(normalized);
}

/**
 * Returns true if the current session user is an admin (DB allow-list).
 * Falls back to ADMIN_ALLOWED_EMAILS when DB check is unavailable.
 *
 * TODO (Step 3): Use in admin layout middleware; sync admin_users from env on first login.
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return false;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return false;
  }

  const email = user.email.trim().toLowerCase();

  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (!error && data) {
    return true;
  }

  return isEmailInAllowedList(email);
}

/**
 * Server-only: verify admin by email using service role (e.g. bootstrap scripts).
 */
export async function isAdminEmailInDatabase(
  email: string,
): Promise<boolean> {
  const admin = createAdminSupabaseClient();
  if (!admin) return isEmailInAllowedList(email);

  const { data } = await admin
    .from("admin_users")
    .select("id")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  return Boolean(data) || isEmailInAllowedList(email);
}
