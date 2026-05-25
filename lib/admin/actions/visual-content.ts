"use server";

import type { ActionResult } from "@/lib/admin/action-result";
import { actionError, actionOk } from "@/lib/admin/action-result";
import { adminErrors } from "@/lib/admin/copy";
import { revalidatePublicSite } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  isVisualContentKey,
  type VisualContentKey,
} from "@/lib/admin/visual-content-keys";
import type { SiteContentItem } from "@/types/content";

export type VisualContentUpdate = {
  key: VisualContentKey;
  language: "en" | "he";
  value: string;
};

export async function saveVisualContentUpdates(
  updates: VisualContentUpdate[],
): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  if (!updates.length) {
    return actionOk();
  }

  const valid: VisualContentUpdate[] = [];
  for (const row of updates) {
    if (!isVisualContentKey(row.key)) {
      return actionError(`מפתח לא מורשה: ${row.key}`);
    }
    if (row.language !== "en" && row.language !== "he") {
      return actionError("שפה לא תקינה");
    }
    valid.push({
      key: row.key,
      language: row.language,
      value: row.value.trim(),
    });
  }

  const keys = [...new Set(valid.map((u) => u.key))];
  const { data: existingRows, error: fetchError } = await ctx.supabase
    .from("site_content")
    .select("key, value_en, value_he")
    .in("key", keys);

  if (fetchError) {
    return actionError(fetchError.message);
  }

  const byKey = new Map<string, { value_en: string | null; value_he: string | null }>();
  for (const row of (existingRows ?? []) as Pick<
    SiteContentItem,
    "key" | "value_en" | "value_he"
  >[]) {
    byKey.set(row.key, {
      value_en: row.value_en,
      value_he: row.value_he,
    });
  }

  for (const update of valid) {
    const current = byKey.get(update.key) ?? {
      value_en: null,
      value_he: null,
    };
    if (update.language === "en") {
      current.value_en = update.value || null;
    } else {
      current.value_he = update.value || null;
    }
    byKey.set(update.key, current);
  }

  for (const [key, values] of byKey) {
    const { error } = await ctx.supabase.from("site_content").upsert(
      {
        key,
        value_en: values.value_en,
        value_he: values.value_he,
      },
      { onConflict: "key" },
    );

    if (error) {
      return actionError(adminErrors.saveContentFailed(key, error.message));
    }
  }

  revalidatePublicSite();
  return actionOk();
}
