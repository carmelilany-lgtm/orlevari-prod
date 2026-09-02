"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import {
  adminBtnDanger,
  adminBtnSecondary,
  adminCardClass,
  adminTableClass,
  adminTdClass,
  adminThClass,
} from "@/components/admin/admin-styles";
import { AdminSearchField } from "@/components/admin/AdminSearchField";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { deleteLead, type LeadRow } from "@/lib/admin/actions/leads";
import { adminCopy } from "@/lib/admin/copy";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Props = {
  initialLeads: LeadRow[];
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("he-IL", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function formatLanguage(lang: string) {
  if (lang === "he") return adminCopy.leads.langHe;
  if (lang === "en") return adminCopy.leads.langEn;
  return lang;
}

function matchesLeadQuery(row: LeadRow, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    row.full_name,
    row.email,
    row.phone,
    row.service_type ?? "",
    row.message ?? "",
    row.language,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function LeadsManager({ initialLeads }: Props) {
  const router = useRouter();
  const leads = initialLeads;
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<LeadRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredLeads = useMemo(
    () => leads.filter((row) => matchesLeadQuery(row, query)),
    [leads, query],
  );

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteLead(deleteId);
    setLoading(false);
    setDeleteId(null);
    if (!result.success) {
      setError(result.error);
      return;
    }
    if (selected?.id === deleteId) setSelected(null);
    router.refresh();
  }

  return (
    <div className="space-y-6 text-right">
      <AdminAlert variant="error" message={error} />

      {leads.length === 0 ? (
        <AdminEmptyState
          title={adminCopy.leads.emptyTitle}
          description={adminCopy.leads.emptyDesc}
        />
      ) : (
        <>
          <AdminSearchField value={query} onChange={setQuery} />
          {filteredLeads.length === 0 ? (
            <AdminEmptyState title={adminCopy.search.noResults} />
          ) : (
        <div className={`${adminCardClass} overflow-x-auto`}>
          <table className={adminTableClass}>
            <thead>
              <tr>
                <th className={adminThClass}>{adminCopy.leads.tableName}</th>
                <th className={adminThClass}>{adminCopy.leads.tableEmail}</th>
                <th className={adminThClass}>{adminCopy.leads.tablePhone}</th>
                <th className={adminThClass}>{adminCopy.leads.tableService}</th>
                <th className={adminThClass}>{adminCopy.leads.tableDate}</th>
                <th className={adminThClass}>{adminCopy.categories.tableActions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((row) => (
                <tr key={row.id}>
                  <td className={adminTdClass}>{row.full_name}</td>
                  <td className={adminTdClass} dir="ltr">
                    {row.email}
                  </td>
                  <td className={adminTdClass} dir="ltr">
                    {row.phone}
                  </td>
                  <td className={adminTdClass}>{row.service_type ?? "-"}</td>
                  <td className={adminTdClass}>{formatDate(row.created_at)}</td>
                  <td className={adminTdClass}>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={adminBtnSecondary}
                        onClick={() => setSelected(row)}
                      >
                        {adminCopy.actions.view}
                      </button>
                      <button
                        type="button"
                        className={adminBtnDanger}
                        onClick={() => setDeleteId(row.id)}
                      >
                        {adminCopy.actions.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          )}
        </>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-blue-900/50 bg-[#0f1729] p-6 text-right">
            <h2 className="text-lg font-semibold text-white">
              {adminCopy.leads.detailsTitle}
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">{adminCopy.leads.name}</dt>
                <dd className="text-slate-100">{selected.full_name}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{adminCopy.leads.email}</dt>
                <dd className="text-slate-100" dir="ltr">
                  {selected.email}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">{adminCopy.leads.phone}</dt>
                <dd className="text-slate-100" dir="ltr">
                  {selected.phone}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">{adminCopy.leads.service}</dt>
                <dd className="text-slate-100">{selected.service_type ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{adminCopy.leads.message}</dt>
                <dd className="whitespace-pre-wrap text-slate-100">
                  {selected.message ?? "-"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">{adminCopy.leads.language}</dt>
                <dd className="text-slate-100">
                  {formatLanguage(selected.language)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">{adminCopy.leads.privacy}</dt>
                <dd className="text-slate-100">
                  {selected.privacy_accepted
                    ? adminCopy.leads.yes
                    : adminCopy.leads.no}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">{adminCopy.leads.submitted}</dt>
                <dd className="text-slate-100">
                  {formatDate(selected.created_at)}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              className={`${adminBtnSecondary} mt-6`}
              onClick={() => setSelected(null)}
            >
              {adminCopy.actions.close}
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        open={Boolean(deleteId)}
        title={adminCopy.leads.deleteTitle}
        message={adminCopy.leads.deleteMessage}
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
