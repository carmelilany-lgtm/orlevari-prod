import { adminCardClass } from "@/components/admin/admin-styles";

export function SupabaseConfigBanner() {
  return (
    <div className={`${adminCardClass} border-amber-800/40 bg-amber-950/20`}>
      <h2 className="text-lg font-semibold text-amber-200">
        Supabase not configured
      </h2>
      <p className="mt-2 text-sm text-amber-100/80">
        Set{" "}
        <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
        and{" "}
        <code className="rounded bg-black/30 px-1">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>{" "}
        in your environment to use the admin panel. Sign-in and data management
        require a connected Supabase project.
      </p>
    </div>
  );
}
