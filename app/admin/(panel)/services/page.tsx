import { ServicesManager } from "@/components/admin/ServicesManager";
import { SupabaseConfigBanner } from "@/components/admin/SupabaseConfigBanner";
import { listServices } from "@/lib/admin/actions/services";
import { requireAdminPage } from "@/lib/admin/guard";

export default async function AdminServicesPage() {
  const session = await requireAdminPage();
  if (!session.configured) return <SupabaseConfigBanner />;

  const result = await listServices();
  const services = result.success ? (result.data ?? []) : [];

  return (
    <>
      {!result.success && (
        <p className="mb-4 text-sm text-red-300" role="alert">
          {result.error}
        </p>
      )}
      <ServicesManager initialServices={services} />
    </>
  );
}
