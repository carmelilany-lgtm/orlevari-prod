import Link from "next/link";
import { adminCardClass, adminBtnSecondary } from "@/components/admin/admin-styles";
import { SupabaseConfigBanner } from "@/components/admin/SupabaseConfigBanner";
import {
  getDashboardStats,
  getRecentLeads,
} from "@/lib/admin/actions/dashboard";
import { requireAdminPage } from "@/lib/admin/guard";

export default async function AdminDashboardPage() {
  const session = await requireAdminPage();

  if (!session.configured) {
    return <SupabaseConfigBanner />;
  }

  const [statsResult, leadsResult] = await Promise.all([
    getDashboardStats(),
    getRecentLeads(5),
  ]);

  const stats = statsResult.success ? statsResult.data : null;
  const recentLeads = leadsResult.success ? (leadsResult.data ?? []) : [];

  const cards = stats
    ? [
        { label: "Published videos", value: stats.publishedVideos },
        { label: "Video categories", value: stats.categories },
        { label: "Still images", value: stats.stillImages },
        { label: "Services", value: stats.services },
        { label: "Leads", value: stats.leads },
      ]
    : [];

  return (
    <div className="space-y-8">
      {!statsResult.success && (
        <p className="text-sm text-red-300" role="alert">
          {statsResult.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className={adminCardClass}>
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Quick links</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/videos" className={adminBtnSecondary}>
            Add video
          </Link>
          <Link href="/admin/stills" className={adminBtnSecondary}>
            Upload still image
          </Link>
          <Link href="/admin/content" className={adminBtnSecondary}>
            Edit homepage content
          </Link>
        </div>
      </section>

      <section className={`${adminCardClass} space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent leads</h2>
          <Link href="/admin/leads" className="text-sm text-blue-400 hover:text-blue-300">
            View all
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <p className="text-sm text-slate-500">No leads yet.</p>
        ) : (
          <ul className="divide-y divide-blue-950/60">
            {recentLeads.map((lead) => (
              <li key={lead.id} className="py-3 text-sm">
                <span className="font-medium text-slate-200">
                  {lead.full_name}
                </span>
                <span className="text-slate-500"> · {lead.email}</span>
                <p className="text-xs text-slate-500">
                  {new Date(lead.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
