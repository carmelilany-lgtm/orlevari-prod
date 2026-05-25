import { adminCardClass } from "@/components/admin/admin-styles";
import { adminCopy } from "@/lib/admin/copy";

export function SupabaseConfigBanner() {
  return (
    <div
      className={`${adminCardClass} border-amber-800/40 bg-amber-950/20 text-right`}
    >
      <h2 className="text-lg font-semibold text-amber-200">
        {adminCopy.supabaseBanner.title}
      </h2>
      <p className="mt-2 text-sm text-amber-100/80">
        {adminCopy.supabaseBanner.body}
      </p>
    </div>
  );
}
