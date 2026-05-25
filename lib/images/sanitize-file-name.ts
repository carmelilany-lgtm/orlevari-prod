/** Safe file name for storage paths */
export function sanitizeFileName(name: string): string {
  const base = name.replace(/[/\\?%*:|"<>]/g, "").trim() || "image";
  return base
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 80);
}
