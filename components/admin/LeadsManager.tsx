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
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { deleteLead, type LeadRow } from "@/lib/admin/actions/leads";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initialLeads: LeadRow[];
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IL", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function LeadsManager({ initialLeads }: Props) {
  const router = useRouter();
  const leads = initialLeads;
  const [selected, setSelected] = useState<LeadRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="space-y-6">
      <AdminAlert variant="error" message={error} />

      {leads.length === 0 ? (
        <AdminEmptyState
          title="No leads yet."
          description="Contact form submissions will appear here."
        />
      ) : (
        <div className={`${adminCardClass} overflow-x-auto`}>
          <table className={adminTableClass}>
            <thead>
              <tr>
                <th className={adminThClass}>Name</th>
                <th className={adminThClass}>Email</th>
                <th className={adminThClass}>Phone</th>
                <th className={adminThClass}>Service</th>
                <th className={adminThClass}>Date</th>
                <th className={adminThClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((row) => (
                <tr key={row.id}>
                  <td className={adminTdClass}>{row.full_name}</td>
                  <td className={adminTdClass}>{row.email}</td>
                  <td className={adminTdClass}>{row.phone}</td>
                  <td className={adminTdClass}>{row.service_type ?? "—"}</td>
                  <td className={adminTdClass}>{formatDate(row.created_at)}</td>
                  <td className={adminTdClass}>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={adminBtnSecondary}
                        onClick={() => setSelected(row)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className={adminBtnDanger}
                        onClick={() => setDeleteId(row.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-blue-900/50 bg-[#0f1729] p-6">
            <h2 className="text-lg font-semibold text-white">Lead details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Name</dt>
                <dd className="text-slate-100">{selected.full_name}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Email</dt>
                <dd className="text-slate-100">{selected.email}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Phone</dt>
                <dd className="text-slate-100">{selected.phone}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Service</dt>
                <dd className="text-slate-100">{selected.service_type ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Message</dt>
                <dd className="whitespace-pre-wrap text-slate-100">
                  {selected.message ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Language</dt>
                <dd className="text-slate-100">{selected.language}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Privacy accepted</dt>
                <dd className="text-slate-100">
                  {selected.privacy_accepted ? "Yes" : "No"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Submitted</dt>
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
              Close
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        open={Boolean(deleteId)}
        title="Delete lead?"
        message="This contact submission will be permanently removed."
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
