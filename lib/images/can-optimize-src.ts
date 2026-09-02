/** True when `next/image` can fetch and cache the source (not a local blob preview). */
export function canOptimizeImageSrc(src: string): boolean {
  const value = src.trim();
  if (!value) return false;
  if (value.startsWith("blob:") || value.startsWith("data:")) return false;
  if (value.startsWith("/")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
