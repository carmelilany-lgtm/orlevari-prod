import { ContentEditor } from "@/components/admin/ContentEditor";
import { SupabaseConfigBanner } from "@/components/admin/SupabaseConfigBanner";
import { listSiteContent } from "@/lib/admin/actions/content";
import { requireAdminPage } from "@/lib/admin/guard";

export default async function AdminContentPage() {
  const session = await requireAdminPage();
  if (!session.configured) return <SupabaseConfigBanner />;

  const result = await listSiteContent();
  const content = result.success ? (result.data ?? []) : [];

  return (
    <>
      {!result.success && (
        <p className="mb-4 text-sm text-red-300" role="alert">
          {result.error}
        </p>
      )}
      <ContentEditor initialContent={content} />
    </>
  );
}
