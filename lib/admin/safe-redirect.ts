/**
 * Allow only safe internal admin paths for post-login redirects.
 */
export function getSafeAdminRedirect(next: string | null | undefined): string {
  if (!next || typeof next !== "string") {
    return "/admin";
  }

  const trimmed = next.trim();

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("//") ||
    !trimmed.startsWith("/")
  ) {
    return "/admin";
  }

  if (!trimmed.startsWith("/admin") || trimmed === "/admin/login") {
    return "/admin";
  }

  return trimmed;
}
