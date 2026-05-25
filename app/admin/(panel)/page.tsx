import Link from "next/link";
import { adminCardClass, adminBtnSecondary } from "@/components/admin/admin-styles";
import { SupabaseConfigBanner } from "@/components/admin/SupabaseConfigBanner";
import {
  getDashboardStats,
  getRecentLeads,
} from "@/lib/admin/actions/dashboard";
import { adminCopy } from "@/lib/admin/copy";
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
        { label: adminCopy.dashboard.publishedVideos, value: stats.publishedVideos },
        { label: adminCopy.dashboard.videoCategories, value: stats.categories },
        { label: adminCopy.dashboard.stillImages, value: stats.stillImages },
        { label: adminCopy.dashboard.services, value: stats.services },
        { label: adminCopy.dashboard.leads, value: stats.leads },
      ]
    : [];

  return (
    <div className="space-y-8 text-right">
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
        <h2 className="text-lg font-semibold text-white">
          {adminCopy.dashboard.quickLinks}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/videos" className={adminBtnSecondary}>
            {adminCopy.dashboard.addVideo}
          </Link>
          <Link href="/admin/stills" className={adminBtnSecondary}>
            {adminCopy.dashboard.uploadStill}
          </Link>
          <Link href="/admin/content" className={adminBtnSecondary}>
            {adminCopy.dashboard.editHomepage}
          </Link>
        </div>
      </section>

      <section className={`${adminCardClass} space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {adminCopy.dashboard.recentLeads}
          </h2>
          <Link href="/admin/leads" className="text-sm text-blue-400 hover:text-blue-300">
            {adminCopy.actions.viewAll}
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <p className="text-sm text-slate-500">{adminCopy.dashboard.noLeadsYet}</p>
        ) : (
          <ul className="divide-y divide-blue-950/60">
            {recentLeads.map((lead) => {
              const createdAt = new Date(lead.created_at).toLocaleString(
                "he-IL",
                { dateStyle: "medium", timeStyle: "short" },
              );
              return (
                <li key={lead.id} className="py-3.5">
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-medium text-slate-100">
                        {lead.full_name}
                      </p>
                      <p
                        dir="ltr"
                        className="truncate text-left text-sm text-slate-400"
                      >
                        {lead.email}
                      </p>
                      {lead.service_type ? (
                        <p className="text-xs text-slate-500">
                          {lead.service_type}
                        </p>
                      ) : null}
                    </div>
                    <time
                      dateTime={lead.created_at}
                      className="shrink-0 pt-0.5 text-xs leading-snug text-slate-500 tabular-nums"
                    >
                      {createdAt}
                    </time>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
