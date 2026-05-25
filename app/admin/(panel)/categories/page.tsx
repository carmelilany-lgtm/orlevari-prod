import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { SupabaseConfigBanner } from "@/components/admin/SupabaseConfigBanner";
import { listVideoCategories } from "@/lib/admin/actions/categories";
import { requireAdminPage } from "@/lib/admin/guard";

export default async function AdminCategoriesPage() {
  const session = await requireAdminPage();
  if (!session.configured) return <SupabaseConfigBanner />;

  const result = await listVideoCategories();
  const categories = result.success ? (result.data ?? []) : [];

  return (
    <>
      {!result.success && (
        <p className="mb-4 text-sm text-red-300" role="alert">
          {result.error}
        </p>
      )}
      <CategoriesManager initialCategories={categories} />
    </>
  );
}
