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
  deleteVideoCategory,
  saveVideoCategory,
  toggleCategoryPublished,
  type VideoCategoryRow,
} from "@/lib/admin/actions/categories";
import { categoryAdminPrimary, categoryAdminSecondary } from "@/lib/admin/category-label";
import { adminCopy } from "@/lib/admin/copy";
import { slugifyTitle } from "@/lib/admin/slug";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initialCategories: VideoCategoryRow[];
};

const emptyForm = {
  title_en: "",
  title_he: "",
  slug: "",
  sort_order: 0,
  initial_visible_count: 3,
  is_published: true,
};

export function CategoriesManager({ initialCategories }: Props) {
  const router = useRouter();
  const categories = initialCategories;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [slugManual, setSlugManual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setSlugManual(false);
    setFormOpen(true);
    setError("");
    setSuccess("");
  }

  function openEdit(row: VideoCategoryRow) {
    setEditingId(row.id);
    setForm({
      title_en: row.title_en,
      title_he: row.title_he,
      slug: row.slug,
      sort_order: row.sort_order,
      initial_visible_count: row.initial_visible_count,
      is_published: row.is_published,
    });
    setSlugManual(true);
    setFormOpen(true);
    setError("");
    setSuccess("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const result = await saveVideoCategory({
      id: editingId ?? undefined,
      ...form,
    });

    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(editingId ? adminCopy.categories.updated : adminCopy.categories.created);
    setFormOpen(false);
    router.refresh();
  }

  async function handleToggle(id: string, published: boolean) {
    const result = await toggleCategoryPublished(id, published);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteVideoCategory(deleteId);
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-400">{adminCopy.categories.intro}</p>
        <button type="button" className={adminBtnPrimary} onClick={openCreate}>
          {adminCopy.categories.add}
        </button>
      </div>

      <AdminAlert variant="error" message={error} />
      <AdminAlert variant="success" message={success} />

      {formOpen && (
        <form onSubmit={handleSave} className={`${adminCardClass} space-y-4`}>
          <h2 className="text-lg font-semibold text-white">
            {editingId ? adminCopy.categories.edit : adminCopy.categories.new}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField
              label={adminCopy.categories.titleEn}
              name="title_en"
              dir="ltr"
              value={form.title_en}
              required
              onChange={(v) => {
                setForm((f) => ({
                  ...f,
                  title_en: v,
                  slug: slugManual ? f.slug : slugifyTitle(v),
                }));
              }}
            />
            <AdminFormField
              label={adminCopy.categories.titleHe}
              name="title_he"
              dir="rtl"
              value={form.title_he}
              required
              onChange={(v) => setForm((f) => ({ ...f, title_he: v }))}
            />
            <AdminFormField
              label={adminCopy.categories.slug}
              name="slug"
              dir="ltr"
              value={form.slug}
              required
              hint={adminCopy.categories.slugHint}
              onChange={(v) => {
                setSlugManual(true);
                setForm((f) => ({ ...f, slug: v }));
              }}
            />
            <AdminFormField
              label={adminCopy.categories.initialVisible}
              name="initial_visible_count"
              type="number"
              min={1}
              hint={adminCopy.categories.initialVisibleHint}
              value={form.initial_visible_count}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  initial_visible_count: Math.max(1, Number(v) || 3),
                }))
              }
            />
            <SortOrderField
              value={form.sort_order}
              onChange={(v) => setForm((f) => ({ ...f, sort_order: v }))}
            />
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_published: e.target.checked }))
                  }
                  className="rounded border-blue-800"
                />
                {adminCopy.publish.published}
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className={adminBtnPrimary} disabled={loading}>
              {loading ? adminCopy.actions.saving : adminCopy.actions.save}
            </button>
            <button
              type="button"
              className={adminBtnSecondary}
              onClick={() => setFormOpen(false)}
            >
              {adminCopy.actions.cancel}
            </button>
          </div>
        </form>
      )}

      {categories.length === 0 ? (
        <AdminEmptyState
          title={adminCopy.categories.emptyTitle}
          description={adminCopy.categories.emptyDesc}
          action={
            <button type="button" className={adminBtnPrimary} onClick={openCreate}>
              {adminCopy.categories.add}
            </button>
          }
        />
      ) : (
        <div className={`${adminCardClass} overflow-x-auto`}>
          <table className={adminTableClass}>
            <thead>
              <tr>
                <th className={adminThClass}>{adminCopy.categories.tableTitle}</th>
                <th className={adminThClass}>{adminCopy.categories.tableSlug}</th>
                <th className={adminThClass}>{adminCopy.categories.tableOrder}</th>
                <th className={adminThClass}>{adminCopy.categories.tableVisible}</th>
                <th className={adminThClass}>{adminCopy.categories.tableStatus}</th>
                <th className={adminThClass}>{adminCopy.categories.tableActions}</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((row) => (
                <tr key={row.id}>
                  <td className={adminTdClass}>
                    <span className="block font-medium text-white">
                      {categoryAdminPrimary(row)}
                    </span>
                    {categoryAdminSecondary(row) ? (
                      <span className="mt-0.5 block text-xs text-slate-500" dir="ltr">
                        {categoryAdminSecondary(row)}
                      </span>
                    ) : null}
                  </td>
                  <td className={adminTdClass}>{row.slug}</td>
                  <td className={adminTdClass}>{row.sort_order}</td>
                  <td className={adminTdClass}>{row.initial_visible_count}</td>
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
                        {adminCopy.actions.edit}
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

      <DeleteConfirmDialog
        open={Boolean(deleteId)}
        title={adminCopy.categories.deleteTitle}
        message={adminCopy.categories.deleteMessage}
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
