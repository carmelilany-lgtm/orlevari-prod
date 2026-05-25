export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isSupabaseServiceRoleConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function warnSupabaseMissing(context: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.warn(
    `[lev-ari] Supabase not configured (${context}). Using mock/fallback data.`,
  );
}
