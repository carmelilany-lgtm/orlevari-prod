import { IntegrationsPanel } from "@/components/admin/IntegrationsPanel";
import { SupabaseConfigBanner } from "@/components/admin/SupabaseConfigBanner";
import { adminCopy } from "@/lib/admin/copy";
import { getIntegrationStatus } from "@/lib/env/diagnostics";
import { requireAdminPage } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

export default async function AdminIntegrationsPage() {
  const session = await requireAdminPage();

  if (!session.configured) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white">
          {adminCopy.integrations.title}
        </h1>
        <SupabaseConfigBanner />
      </div>
    );
  }

  const status = await getIntegrationStatus();

  return <IntegrationsPanel status={status} />;
}
