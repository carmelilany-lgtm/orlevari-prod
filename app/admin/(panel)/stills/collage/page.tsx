import { StillsCollageEditor } from "@/components/admin/StillsCollageEditor";
import { SupabaseConfigBanner } from "@/components/admin/SupabaseConfigBanner";
import { listStillImages } from "@/lib/admin/actions/stills";
import { requireAdminPage } from "@/lib/admin/guard";
import { getSiteUrl } from "@/lib/seo/site-url";

export default async function AdminStillsCollagePage() {
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
      <StillsCollageEditor
        initialStills={stills}
        publicSiteUrl={getSiteUrl()}
      />
    </>
  );
}
