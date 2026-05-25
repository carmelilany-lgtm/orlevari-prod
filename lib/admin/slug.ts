/** Generate a URL-safe slug from English title */
export function slugifyTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
