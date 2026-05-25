"use server";

import { redirect } from "next/navigation";
import { ensureAdminUserInDatabase } from "@/lib/auth/ensure-admin-user";
import { isCurrentUserAdmin } from "@/lib/auth/is-admin";
import type { ActionResult } from "@/lib/admin/action-result";
import { actionError, actionOk } from "@/lib/admin/action-result";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function signOutAdmin(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

export async function verifyAdminSession(): Promise<ActionResult<{ email: string }>> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return actionError("Supabase is not configured.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return actionError("Not signed in.");
  }

  await ensureAdminUserInDatabase(user.email);

  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    await supabase.auth.signOut();
    return actionError(
      "Access denied. Your account is not authorized as an admin.",
    );
  }

  return actionOk({ email: user.email });
}
