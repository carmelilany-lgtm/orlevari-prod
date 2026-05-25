"use server";

import type { ActionResult } from "@/lib/admin/action-result";
import { actionError, actionOk } from "@/lib/admin/action-result";
import { adminErrors } from "@/lib/admin/copy";
import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/admin/require-admin";
import { clampCollageLayoutItem } from "@/lib/stills/collage-layout";

export type LiveCollageLayoutItem = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  sort_order: number;
};

export async function saveStillsLiveCollageLayout(
  items: LiveCollageLayoutItem[],
): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  if (!Array.isArray(items) || items.length === 0) {
    return actionError(adminErrors.collageSaveFailed);
  }

  const { data: existing, error: listError } = await ctx.supabase
    .from("still_images")
    .select("id");

  if (listError) return actionError(adminErrors.collageSaveFailed);

  const validIds = new Set((existing ?? []).map((row) => row.id));

  for (const item of items) {
    if (!validIds.has(item.id)) {
      return actionError(adminErrors.collageSaveFailed);
    }

    const layout = clampCollageLayoutItem({
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
    });

    const { error } = await ctx.supabase
      .from("still_images")
      .update({
        sort_order: item.sort_order,
        collage_layout: layout,
      })
      .eq("id", item.id);

    if (error) return actionError(adminErrors.collageSaveFailed);
  }

  revalidatePublicSite();
  revalidatePath("/admin/stills");
  return actionOk();
}

export async function resetStillsCollageLayout(): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { error } = await ctx.supabase
    .from("still_images")
    .update({ collage_layout: null })
    .not("id", "is", null);

  if (error) return actionError(adminErrors.collageSaveFailed);

  revalidatePublicSite();
  revalidatePath("/admin/stills");
  return actionOk();
}
