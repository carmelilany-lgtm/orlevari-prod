"use server";

import type { ActionResult } from "@/lib/admin/action-result";
import { actionError, actionOk } from "@/lib/admin/action-result";
import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/admin/require-admin";
import { layoutFromSize, type CollageSize } from "@/lib/stills/collage-layout";

export type CollageLayoutItem = {
  id: string;
  sort_order: number;
  size: CollageSize;
};

export async function saveStillsCollageLayout(
  items: CollageLayoutItem[],
): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  for (const item of items) {
    const layout = layoutFromSize(item.size);
    const { error } = await ctx.supabase
      .from("still_images")
      .update({
        sort_order: item.sort_order,
        collage_layout: layout,
      })
      .eq("id", item.id);

    if (error) return actionError(error.message);
  }

  revalidatePublicSite();
  revalidatePath("/admin/stills");
  revalidatePath("/admin/stills/collage");
  return actionOk();
}

export async function resetStillsCollageLayout(): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { error } = await ctx.supabase
    .from("still_images")
    .update({ collage_layout: null })
    .not("id", "is", null);

  if (error) return actionError(error.message);

  revalidatePublicSite();
  revalidatePath("/admin/stills");
  revalidatePath("/admin/stills/collage");
  return actionOk();
}
