"use server";

import type { ActionResult } from "@/lib/admin/action-result";
import { actionError, actionOk } from "@/lib/admin/action-result";
import { adminErrors } from "@/lib/admin/copy";
import { revalidateSiteAndAdminMedia } from "@/lib/admin/revalidate";
import { requireAdmin, type AdminContext } from "@/lib/admin/require-admin";
import { ensureAdminUserInDatabase } from "@/lib/auth/ensure-admin-user";
import { optimizeImageForPublicStorage } from "@/lib/images/optimize-upload";
import { STORAGE_CACHE_CONTROL } from "@/lib/images/storage-cache-control";
import { buildMediaStoragePath } from "@/lib/images/sanitize-file-name";
import { resolveImageMime } from "@/lib/images/still-upload-validation";

const ABOUT_BUCKET = "about";
const ABOUT_IMAGE_KEY = "about_image_url";
const ABOUT_STORAGE_KEY = "about_image_storage_path";
const ABOUT_EXTENDED_IMAGE_KEY = "about_extended_image_url";
const ABOUT_EXTENDED_STORAGE_KEY = "about_extended_image_storage_path";

async function uploadAboutBucketImage(
  ctx: AdminContext,
  formData: FormData,
  imageKey: string,
  storageKey: string,
  pathPrefix: string,
): Promise<ActionResult<{ url: string }>> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return actionError(adminErrors.noImageFile);
  }

  const contentType = resolveImageMime(file.type, file.name);
  if (!contentType) {
    return actionError(adminErrors.invalidImageType);
  }

  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return actionError(adminErrors.imageTooLarge);
  }

  const timestamp = Date.now();
  const arrayBuffer = await file.arrayBuffer();
  let uploadBody: Buffer | ArrayBuffer = arrayBuffer;
  let uploadType = contentType;
  let uploadName = file.name;

  try {
    const optimized = await optimizeImageForPublicStorage(arrayBuffer);
    uploadBody = optimized.buffer;
    uploadType = optimized.contentType;
    uploadName = optimized.fileName;
  } catch (error) {
    console.error(
      "[lev-ari] about image optimize:",
      error instanceof Error ? error.message : error,
    );
  }

  const storagePath = buildMediaStoragePath(
    pathPrefix,
    timestamp,
    0,
    uploadType,
    uploadName,
  );

  const { data: existingRows } = await ctx.supabase
    .from("site_content")
    .select("key, value_en")
    .in("key", [storageKey]);

  const oldPath =
    existingRows?.find((r) => r.key === storageKey)?.value_en?.trim() ||
    null;

  const { error: uploadError } = await ctx.supabase.storage
    .from(ABOUT_BUCKET)
    .upload(storagePath, uploadBody, {
      contentType: uploadType,
      cacheControl: STORAGE_CACHE_CONTROL,
      upsert: false,
    });

  if (uploadError) {
    console.error("[lev-ari] about upload storage:", uploadError.message);
    const msg = uploadError.message?.toLowerCase() ?? "";
    if (msg.includes("mime") || msg.includes("content")) {
      return actionError(adminErrors.invalidImageType);
    }
    if (msg.includes("policy") || msg.includes("authorized")) {
      return actionError(adminErrors.accessDenied);
    }
    return actionError(adminErrors.storageUploadFailed);
  }

  const {
    data: { publicUrl },
  } = ctx.supabase.storage.from(ABOUT_BUCKET).getPublicUrl(storagePath);

  const upserts = [
    { key: imageKey, value_en: publicUrl, value_he: publicUrl },
    { key: storageKey, value_en: storagePath, value_he: storagePath },
  ];

  for (const row of upserts) {
    const { error } = await ctx.supabase
      .from("site_content")
      .upsert(row, { onConflict: "key" });

    if (error) {
      await ctx.supabase.storage.from(ABOUT_BUCKET).remove([storagePath]);
      return actionError(adminErrors.saveContentFailed(row.key, error.message));
    }
  }

  if (oldPath && oldPath !== storagePath) {
    await ctx.supabase.storage.from(ABOUT_BUCKET).remove([oldPath]);
  }

  revalidateSiteAndAdminMedia();
  return actionOk({ url: publicUrl });
}

export async function uploadAboutImage(formData: FormData): Promise<
  ActionResult<{ url: string }>
> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  await ensureAdminUserInDatabase(ctx.email);
  return uploadAboutBucketImage(
    ctx,
    formData,
    ABOUT_IMAGE_KEY,
    ABOUT_STORAGE_KEY,
    "about",
  );
}

export async function uploadAboutExtendedImage(formData: FormData): Promise<
  ActionResult<{ url: string }>
> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  await ensureAdminUserInDatabase(ctx.email);
  return uploadAboutBucketImage(
    ctx,
    formData,
    ABOUT_EXTENDED_IMAGE_KEY,
    ABOUT_EXTENDED_STORAGE_KEY,
    "about/extended",
  );
}
