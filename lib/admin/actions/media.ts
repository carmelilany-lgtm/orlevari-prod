"use server";

import type { ActionResult } from "@/lib/admin/action-result";
import { actionError, actionOk } from "@/lib/admin/action-result";
import { adminErrors } from "@/lib/admin/copy";
import { revalidateSiteAndAdminMedia } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/admin/require-admin";
import { ensureAdminUserInDatabase } from "@/lib/auth/ensure-admin-user";
import {
  normalizeImageMime,
  sanitizeFileName,
  storageExtensionForUpload,
} from "@/lib/images/sanitize-file-name";

const ABOUT_BUCKET = "about";
const ABOUT_IMAGE_KEY = "about_image_url";
const ABOUT_STORAGE_KEY = "about_image_storage_path";

export async function uploadAboutImage(formData: FormData): Promise<
  ActionResult<{ url: string }>
> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  await ensureAdminUserInDatabase(ctx.email);

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return actionError(adminErrors.noImageFile);
  }

  const contentType = normalizeImageMime(file.type);
  if (!contentType) {
    return actionError(adminErrors.invalidImageType);
  }

  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return actionError(adminErrors.imageTooLarge);
  }

  const safeName = sanitizeFileName(file.name) || "image";
  const ext = storageExtensionForUpload(file.type, file.name);
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 10);
  const storagePath = `about/${timestamp}-${random}-${safeName}${ext}`;

  const { data: existingRows } = await ctx.supabase
    .from("site_content")
    .select("key, value_en")
    .in("key", [ABOUT_STORAGE_KEY]);

  const oldPath =
    existingRows?.find((r) => r.key === ABOUT_STORAGE_KEY)?.value_en?.trim() ||
    null;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await ctx.supabase.storage
    .from(ABOUT_BUCKET)
    .upload(storagePath, arrayBuffer, {
      contentType,
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
    return actionError(adminErrors.aboutUploadFailed);
  }

  const {
    data: { publicUrl },
  } = ctx.supabase.storage.from(ABOUT_BUCKET).getPublicUrl(storagePath);

  const upserts = [
    { key: ABOUT_IMAGE_KEY, value_en: publicUrl, value_he: publicUrl },
    { key: ABOUT_STORAGE_KEY, value_en: storagePath, value_he: storagePath },
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
