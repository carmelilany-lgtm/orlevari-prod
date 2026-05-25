import { StillsManager } from "@/components/admin/StillsManager";
import { SupabaseConfigBanner } from "@/components/admin/SupabaseConfigBanner";
import { listStillImages } from "@/lib/admin/actions/stills";
import { requireAdminPage } from "@/lib/admin/guard";

export default async function AdminStillsPage() {
  const session = await requireAdminPage();
  if (!session.configured) return <SupabaseConfigBanner />;

  const result = await listStillImages();
  const stills = result.success ? (result.data ?? []) : [];

  return (
    <>
      {!result.success && (
        <p className="mb-4 text-sm text-red-300" role="alert">
          {result.error}
        </p>
      )}
      <StillsManager initialStills={stills} />
    </>
  );
}
