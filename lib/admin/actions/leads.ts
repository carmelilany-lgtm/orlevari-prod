"use server";

import type { ActionResult } from "@/lib/admin/action-result";
import { actionError, actionOk } from "@/lib/admin/action-result";
import { requireAdmin } from "@/lib/admin/require-admin";
import type { Database } from "@/lib/supabase/types";

export type LeadRow = Database["public"]["Tables"]["leads"]["Row"];

export async function listLeads(): Promise<ActionResult<LeadRow[]>> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { data, error } = await ctx.supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return actionError(error.message);
  return actionOk(data ?? []);
}

export async function deleteLead(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { error } = await ctx.supabase.from("leads").delete().eq("id", id);

  if (error) return actionError(error.message);
  return actionOk();
}
