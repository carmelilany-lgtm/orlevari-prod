"use server";

import type { ActionResult } from "@/lib/admin/action-result";
import { actionError, actionOk } from "@/lib/admin/action-result";
import { adminErrors } from "@/lib/admin/copy";
import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/admin/require-admin";
import type { Database } from "@/lib/supabase/types";

export type VideoCategoryRow =
  Database["public"]["Tables"]["video_categories"]["Row"];

export async function listVideoCategories(): Promise<
  ActionResult<VideoCategoryRow[]>
> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { data, error } = await ctx.supabase
    .from("video_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return actionError(error.message);
  return actionOk(data ?? []);
}

export type CategoryInput = {
  id?: string;
  title_en: string;
  title_he: string;
  slug: string;
  sort_order: number;
  initial_visible_count: number;
  is_published: boolean;
};

function validateCategory(input: CategoryInput): string | null {
  if (!input.title_en.trim()) return adminErrors.titleEnRequired;
  if (!input.title_he.trim()) return adminErrors.titleHeRequired;
  if (!input.slug.trim()) return adminErrors.slugRequired;
  if (input.initial_visible_count < 1) {
    return adminErrors.initialVisibleMin;
  }
  return null;
}

export async function saveVideoCategory(
  input: CategoryInput,
): Promise<ActionResult<{ id: string }>> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const validation = validateCategory(input);
  if (validation) return actionError(validation);

  const payload = {
    title_en: input.title_en.trim(),
    title_he: input.title_he.trim(),
    slug: input.slug.trim().toLowerCase(),
    sort_order: input.sort_order,
    initial_visible_count: input.initial_visible_count,
    is_published: input.is_published,
  };

  if (input.id) {
    const { data, error } = await ctx.supabase
      .from("video_categories")
      .update(payload)
      .eq("id", input.id)
      .select("id")
      .single();

    if (error) return actionError(error.message);
    revalidatePublicSite();
    revalidatePath("/admin/categories");
    return actionOk({ id: data.id });
  }

  const { data, error } = await ctx.supabase
    .from("video_categories")
    .insert(payload)
    .select("id")
    .single();

  if (error) return actionError(error.message);
  revalidatePublicSite();
  revalidatePath("/admin/categories");
  return actionOk({ id: data.id });
}

export async function deleteVideoCategory(
  id: string,
): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { count, error: countError } = await ctx.supabase
    .from("video_works")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) return actionError(countError.message);
  if (count && count > 0) {
    return actionError(adminErrors.categoryDeleteBlocked);
  }

  const { error } = await ctx.supabase
    .from("video_categories")
    .delete()
    .eq("id", id);

  if (error) return actionError(error.message);
  revalidatePublicSite();
  revalidatePath("/admin/categories");
  return actionOk();
}

export async function toggleCategoryPublished(
  id: string,
  is_published: boolean,
): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { error } = await ctx.supabase
    .from("video_categories")
    .update({ is_published })
    .eq("id", id);

  if (error) return actionError(error.message);
  revalidatePublicSite();
  revalidatePath("/admin/categories");
  return actionOk();
}

