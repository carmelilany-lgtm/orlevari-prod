/** Safe file name for storage paths */
export function sanitizeFileName(name: string): string {
  const base = name.replace(/[/\\?%*:|"<>]/g, "").trim() || "image";
  return base
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 60);
}

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export function extensionFromFileName(name: string): string | null {
  const match = name.toLowerCase().match(/\.(jpe?g|png|webp)$/);
  if (!match) return null;
  const ext = match[1];
  if (ext === "jpeg" || ext === "jpg") return ".jpg";
  return `.${ext}`;
}

/** Stable storage extension from MIME (preferred) or file name. */
export function storageExtensionForUpload(
  mime: string,
  fileName: string,
): string {
  const normalized = normalizeImageMime(mime);
  if (normalized && EXT_BY_MIME[normalized]) {
    return EXT_BY_MIME[normalized];
  }
  return extensionFromFileName(fileName) ?? ".jpg";
}

export function normalizeImageMime(type: string): string | null {
  const t = type.trim().toLowerCase();
  if (t === "image/jpg") return "image/jpeg";
  if (t in EXT_BY_MIME) return t;
  return null;
}
