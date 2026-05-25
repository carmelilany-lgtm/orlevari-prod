"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminFormField } from "@/components/admin/AdminFormField";
import {
  adminBtnDanger,
  adminBtnPrimary,
  adminBtnSecondary,
  adminCardClass,
  adminTableClass,
  adminTdClass,
  adminThClass,
} from "@/components/admin/admin-styles";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { SortOrderField } from "@/components/admin/SortOrderField";
import {
  deleteService,
  saveService,
  toggleServicePublished,
  type ServiceRow,
} from "@/lib/admin/actions/services";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initialServices: ServiceRow[];
};

const emptyForm = {
  title_en: "",
  title_he: "",
  description_en: "",
  description_he: "",
  icon_key: "",
  sort_order: 0,
  is_published: true,
};

export function ServicesManager({ initialServices }: Props) {
  const router = useRouter();
  const services = initialServices;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
    setError("");
    setSuccess("");
  }

  function openEdit(row: ServiceRow) {
    setEditingId(row.id);
    setForm({
      title_en: row.title_en,
      title_he: row.title_he,
      description_en: row.description_en ?? "",
      description_he: row.description_he ?? "",
      icon_key: row.icon_key ?? "",
      sort_order: row.sort_order,
      is_published: row.is_published,
    });
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await saveService({
      id: editingId ?? undefined,
      title_en: form.title_en,
      title_he: form.title_he,
      description_en: form.description_en,
      description_he: form.description_he,
      icon_key: form.icon_key,
      sort_order: form.sort_order,
      is_published: form.is_published,
    });
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setSuccess(editingId ? "Service updated." : "Service created.");
    setFormOpen(false);
    router.refresh();
  }

  async function handleToggle(id: string, published: boolean) {
    const result = await toggleServicePublished(id, published);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteService(deleteId);
    setLoading(false);
    setDeleteId(null);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <p className="text-sm text-slate-400">Manage bilingual service offerings.</p>
        <button type="button" className={adminBtnPrimary} onClick={openCreate}>
          Add service
        </button>
      </div>

      <AdminAlert variant="error" message={error} />
      <AdminAlert variant="success" message={success} />

      {formOpen && (
        <form onSubmit={handleSave} className={`${adminCardClass} space-y-4`}>
          <h2 className="text-lg font-semibold text-white">
            {editingId ? "Edit service" : "New service"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField
              label="Title (English)"
              value={form.title_en}
              required
              onChange={(v) => setForm((f) => ({ ...f, title_en: v }))}
            />
            <AdminFormField
              label="Title (Hebrew)"
              value={form.title_he}
              required
              onChange={(v) => setForm((f) => ({ ...f, title_he: v }))}
            />
            <AdminFormField
              as="textarea"
              label="Description (English)"
              value={form.description_en}
              onChange={(v) => setForm((f) => ({ ...f, description_en: v }))}
            />
            <AdminFormField
              as="textarea"
              label="Description (Hebrew)"
              value={form.description_he}
              onChange={(v) => setForm((f) => ({ ...f, description_he: v }))}
            />
            <AdminFormField
              label="Icon key"
              value={form.icon_key}
              hint="Optional icon identifier for the public UI"
              onChange={(v) => setForm((f) => ({ ...f, icon_key: v }))}
            />
            <SortOrderField
              value={form.sort_order}
              onChange={(v) => setForm((f) => ({ ...f, sort_order: v }))}
            />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_published: e.target.checked }))
                }
              />
              Published
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className={adminBtnPrimary} disabled={loading}>
              {loading ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className={adminBtnSecondary}
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {services.length === 0 ? (
        <AdminEmptyState
          title="No services found."
          description="Add services shown on the public homepage."
          action={
            <button type="button" className={adminBtnPrimary} onClick={openCreate}>
              Add service
            </button>
          }
        />
      ) : (
        <div className={`${adminCardClass} overflow-x-auto`}>
          <table className={adminTableClass}>
            <thead>
              <tr>
                <th className={adminThClass}>Title</th>
                <th className={adminThClass}>Icon</th>
                <th className={adminThClass}>Order</th>
                <th className={adminThClass}>Status</th>
                <th className={adminThClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((row) => (
                <tr key={row.id}>
                  <td className={adminTdClass}>{row.title_en}</td>
                  <td className={adminTdClass}>{row.icon_key ?? "—"}</td>
                  <td className={adminTdClass}>{row.sort_order}</td>
                  <td className={adminTdClass}>
                    <PublishToggle
                      published={row.is_published}
                      onToggle={(p) => handleToggle(row.id, p)}
                    />
                  </td>
                  <td className={adminTdClass}>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={adminBtnSecondary}
                        onClick={() => openEdit(row)}
                      >
                        Edit
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

      <DeleteConfirmDialog
        open={Boolean(deleteId)}
        title="Delete service?"
        message="This cannot be undone."
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
