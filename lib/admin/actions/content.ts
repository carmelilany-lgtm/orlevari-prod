"use server";

import type { ActionResult } from "@/lib/admin/action-result";
import { actionError, actionOk } from "@/lib/admin/action-result";
import { adminErrors } from "@/lib/admin/copy";
import { revalidatePublicSite } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/admin/require-admin";
import type { SiteContentItem } from "@/types/content";

export async function listSiteContent(): Promise<ActionResult<SiteContentItem[]>> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { data, error } = await ctx.supabase
    .from("site_content")
    .select("*")
    .order("key", { ascending: true });

  if (error) return actionError(error.message);
  return actionOk((data ?? []) as SiteContentItem[]);
}

export type ContentUpdate = {
  key: string;
  value_en: string | null;
  value_he: string | null;
};

export async function saveSiteContent(
  updates: ContentUpdate[],
): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  for (const row of updates) {
    const { error } = await ctx.supabase
      .from("site_content")
      .update({
        value_en: row.value_en?.trim() || null,
        value_he: row.value_he?.trim() || null,
      })
      .eq("key", row.key);

    if (error) {
      return actionError(adminErrors.saveContentFailed(row.key, error.message));
    }
  }

  revalidatePublicSite();
  return actionOk();
}
