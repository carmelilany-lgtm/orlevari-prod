"use server";

import type { ActionResult } from "@/lib/admin/action-result";
import { actionError, actionOk } from "@/lib/admin/action-result";
import { adminErrors } from "@/lib/admin/copy";
import { revalidatePublicSite } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/admin/require-admin";
import { sanitizeFileName } from "@/lib/images/sanitize-file-name";
import type { Database } from "@/lib/supabase/types";

export type StillImageRow = Database["public"]["Tables"]["still_images"]["Row"];

const STILLS_BUCKET = "stills";

export async function listStillImages(): Promise<ActionResult<StillImageRow[]>> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { data, error } = await ctx.supabase
    .from("still_images")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return actionError(error.message);
  return actionOk(data ?? []);
}

export type StillImageInput = {
  id?: string;
  alt_en: string | null;
  alt_he: string | null;
  sort_order: number;
  is_published: boolean;
};

export async function saveStillImageMeta(
  input: StillImageInput & { id: string },
): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { error } = await ctx.supabase
    .from("still_images")
    .update({
      alt_en: input.alt_en?.trim() || null,
      alt_he: input.alt_he?.trim() || null,
      sort_order: input.sort_order,
      is_published: input.is_published,
    })
    .eq("id", input.id);

  if (error) return actionError(error.message);
  revalidatePublicSite();
  return actionOk();
}

export async function uploadStillImage(formData: FormData): Promise<
  ActionResult<{ id: string }>
> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return actionError(adminErrors.noImageFile);
  }

  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return actionError(adminErrors.invalidImageType);
  }

  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return actionError(adminErrors.imageTooLarge);
  }

  const width = Number(formData.get("width"));
  const height = Number(formData.get("height"));
  const aspectRatio = Number(formData.get("aspect_ratio"));
  const altEn = String(formData.get("alt_en") ?? "").trim();
  const altHe = String(formData.get("alt_he") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  const isPublished = formData.get("is_published") === "true";

  const timestamp = Date.now();
  const safeName = sanitizeFileName(file.name);
  const storagePath = `${timestamp}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await ctx.supabase.storage
    .from(STILLS_BUCKET)
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return actionError(adminErrors.uploadFailed(uploadError.message));
  }

  const {
    data: { publicUrl },
  } = ctx.supabase.storage.from(STILLS_BUCKET).getPublicUrl(storagePath);

  const { data, error } = await ctx.supabase
    .from("still_images")
    .insert({
      image_url: publicUrl,
      storage_path: storagePath,
      alt_en: altEn || null,
      alt_he: altHe || null,
      width: Number.isFinite(width) ? width : null,
      height: Number.isFinite(height) ? height : null,
      aspect_ratio: Number.isFinite(aspectRatio) ? aspectRatio : null,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
      is_published: isPublished,
    })
    .select("id")
    .single();

  if (error) {
    await ctx.supabase.storage.from(STILLS_BUCKET).remove([storagePath]);
    return actionError(error.message);
  }

  revalidatePublicSite();
  return actionOk({ id: data.id });
}

export async function deleteStillImage(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { data: row, error: fetchError } = await ctx.supabase
    .from("still_images")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) return actionError(fetchError.message);

  if (row?.storage_path) {
    const { error: storageError } = await ctx.supabase.storage
      .from(STILLS_BUCKET)
      .remove([row.storage_path]);

    if (storageError) {
      return actionError(adminErrors.storageDeleteFailed(storageError.message));
    }
  }

  const { error } = await ctx.supabase.from("still_images").delete().eq("id", id);

  if (error) return actionError(error.message);
  revalidatePublicSite();
  return actionOk();
}

export async function toggleStillPublished(
  id: string,
  is_published: boolean,
): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { error } = await ctx.supabase
    .from("still_images")
    .update({ is_published })
    .eq("id", id);

  if (error) return actionError(error.message);
  revalidatePublicSite();
  return actionOk();
}
