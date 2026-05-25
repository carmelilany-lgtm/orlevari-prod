"use server";

import type { ActionResult } from "@/lib/admin/action-result";
import { actionError, actionOk } from "@/lib/admin/action-result";
import { adminErrors } from "@/lib/admin/copy";
import { revalidatePublicSite } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/admin/require-admin";
import { parseYoutubeId } from "@/lib/youtube/client";
import type { Database } from "@/lib/supabase/types";

export type VideoWorkRow = Database["public"]["Tables"]["video_works"]["Row"];

export async function listVideoWorks(): Promise<ActionResult<VideoWorkRow[]>> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { data, error } = await ctx.supabase
    .from("video_works")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return actionError(error.message);
  return actionOk(data ?? []);
}

export type VideoWorkInput = {
  id?: string;
  title_en: string;
  title_he: string;
  category_id: string | null;
  youtube_url: string;
  youtube_id: string | null;
  thumbnail_url: string | null;
  custom_cover_url: string | null;
  sort_order: number;
  is_published: boolean;
};

function validateVideo(input: VideoWorkInput): string | null {
  if (!input.title_en.trim()) return adminErrors.titleEnRequired;
  if (!input.title_he.trim()) return adminErrors.titleHeRequired;
  if (!input.youtube_url.trim()) return adminErrors.youtubeRequired;
  const id = parseYoutubeId(input.youtube_url.trim());
  if (!id) return adminErrors.youtubeInvalid;
  return null;
}

function buildYoutubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

export async function saveVideoWork(
  input: VideoWorkInput,
): Promise<ActionResult<{ id: string }>> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const validation = validateVideo(input);
  if (validation) return actionError(validation);

  const youtubeId =
    input.youtube_id?.trim() || parseYoutubeId(input.youtube_url.trim());
  if (!youtubeId) return actionError(adminErrors.youtubeParseFailed);

  const payload = {
    title_en: input.title_en.trim(),
    title_he: input.title_he.trim(),
    category_id: input.category_id || null,
    youtube_url: input.youtube_url.trim(),
    youtube_id: youtubeId,
    thumbnail_url:
      input.thumbnail_url?.trim() || buildYoutubeThumbnail(youtubeId),
    custom_cover_url: input.custom_cover_url?.trim() || null,
    sort_order: input.sort_order,
    is_published: input.is_published,
  };

  if (input.id) {
    const { data, error } = await ctx.supabase
      .from("video_works")
      .update(payload)
      .eq("id", input.id)
      .select("id")
      .single();

    if (error) return actionError(error.message);
    revalidatePublicSite();
    return actionOk({ id: data.id });
  }

  const { data, error } = await ctx.supabase
    .from("video_works")
    .insert(payload)
    .select("id")
    .single();

  if (error) return actionError(error.message);
  revalidatePublicSite();
  return actionOk({ id: data.id });
}

export async function deleteVideoWork(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { error } = await ctx.supabase.from("video_works").delete().eq("id", id);

  if (error) return actionError(error.message);
  revalidatePublicSite();
  return actionOk();
}

export async function toggleVideoPublished(
  id: string,
  is_published: boolean,
): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { error } = await ctx.supabase
    .from("video_works")
    .update({ is_published })
    .eq("id", id);

  if (error) return actionError(error.message);
  revalidatePublicSite();
  return actionOk();
}
