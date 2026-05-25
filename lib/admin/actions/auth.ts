"use server";

import { ensureAdminUserInDatabase } from "@/lib/auth/ensure-admin-user";
import { isCurrentUserAdmin, isEmailInAllowedList } from "@/lib/auth/is-admin";
import { getSafeAdminRedirect } from "@/lib/admin/safe-redirect";
import type { ActionResult } from "@/lib/admin/action-result";
import { actionError, actionOk } from "@/lib/admin/action-result";
import { adminCopy, adminErrors } from "@/lib/admin/copy";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type LoginResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string };

export type SignOutResult = { ok: true } | { ok: false; error: string };

export async function loginAdmin(
  email: string,
  password: string,
  nextPath?: string | null,
): Promise<LoginResult> {
  const trimmedEmail = email.trim().toLowerCase();
  const redirectTo = getSafeAdminRedirect(nextPath);

  if (!trimmedEmail || !password) {
    return { ok: false, error: adminCopy.auth.emailPasswordRequired };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    console.error("Admin login failed", { reason: "supabase_not_configured" });
    return { ok: false, error: adminErrors.supabaseNotConfiguredShort };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  });

  if (signInError) {
    console.error("Admin login failed", { reason: "invalid_credentials" });
    return { ok: false, error: adminCopy.auth.invalidCredentials };
  }

  if (isEmailInAllowedList(trimmedEmail)) {
    try {
      await ensureAdminUserInDatabase(trimmedEmail);
    } catch {
      console.warn("Admin bootstrap failed", { reason: "ensure_admin_user" });
    }
  }

  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    console.warn("Admin access denied");
    await supabase.auth.signOut();
    return {
      ok: false,
      error: adminCopy.auth.accessDenied,
    };
  }

  return { ok: true, redirectTo };
}

export async function signOutAdmin(): Promise<SignOutResult> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { ok: false, error: adminErrors.supabaseNotConfiguredShort };
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Admin sign out failed", { reason: "sign_out_error" });
    return { ok: false, error: adminCopy.auth.signOutFailed };
  }

  return { ok: true };
}

export async function verifyAdminSession(): Promise<ActionResult<{ email: string }>> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return actionError(adminErrors.supabaseNotConfiguredShort);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return actionError(adminErrors.notSignedIn);
  }

  await ensureAdminUserInDatabase(user.email);

  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    await supabase.auth.signOut();
    return actionError(adminCopy.auth.accessDenied);
  }

  return actionOk({ email: user.email });
}
