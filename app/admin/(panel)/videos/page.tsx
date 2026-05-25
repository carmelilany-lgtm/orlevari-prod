import { VideosManager } from "@/components/admin/VideosManager";
import { SupabaseConfigBanner } from "@/components/admin/SupabaseConfigBanner";
import { listVideoCategories } from "@/lib/admin/actions/categories";
import { listVideoWorks } from "@/lib/admin/actions/videos";
import { requireAdminPage } from "@/lib/admin/guard";

export default async function AdminVideosPage() {
  const session = await requireAdminPage();
  if (!session.configured) return <SupabaseConfigBanner />;

  const [videosResult, categoriesResult] = await Promise.all([
    listVideoWorks(),
    listVideoCategories(),
  ]);

  const videos = videosResult.success ? (videosResult.data ?? []) : [];
  const categories = categoriesResult.success ? (categoriesResult.data ?? []) : [];

  return (
    <>
      {!videosResult.success && (
        <p className="mb-4 text-sm text-red-300" role="alert">
          {videosResult.error}
        </p>
      )}
      <VideosManager initialVideos={videos} categories={categories} />
    </>
  );
}
