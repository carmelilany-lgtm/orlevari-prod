import {
  extensionFromFileName,
  normalizeImageMime,
} from "@/lib/images/sanitize-file-name";

export const MAX_BULK_STILL_UPLOAD_FILES = 40;
export const MAX_STILL_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Resolve MIME from type header or file extension (e.g. empty type on some OS exports). */
export function resolveImageMime(type: string, fileName: string): string | null {
  const fromMime = normalizeImageMime(type);
  if (fromMime) return fromMime;

  const ext = extensionFromFileName(fileName);
  if (!ext) return null;
  if (ext === ".jpg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return null;
}

export function isAllowedStillImageFile(file: File): boolean {
  return resolveImageMime(file.type, file.name) != null;
}

export type StillImageValidationError =
  | "invalid_type"
  | "too_large";

export function validateStillImageFile(
  file: File,
): { ok: true } | { ok: false; error: StillImageValidationError } {
  if (!isAllowedStillImageFile(file)) {
    return { ok: false, error: "invalid_type" };
  }
  if (file.size > MAX_STILL_UPLOAD_BYTES) {
    return { ok: false, error: "too_large" };
  }
  return { ok: true };
}

export function stillImageAcceptAttribute(): string {
  return "image/jpeg,image/png,image/webp,image/*";
}
