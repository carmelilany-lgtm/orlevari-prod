"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminSearchField } from "@/components/admin/AdminSearchField";
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
import { YouTubePreview } from "@/components/admin/YouTubePreview";
import {
  deleteVideoWork,
  saveVideoWork,
  toggleVideoPublished,
  type VideoWorkRow,
} from "@/lib/admin/actions/videos";
import {
  parseYoutubeId,
  youtubeThumbnailUrl,
} from "@/lib/youtube/client";
import type { VideoCategoryRow } from "@/lib/admin/actions/categories";
import {
  categoryAdminLabel,
  categoryAdminPrimary,
} from "@/lib/admin/category-label";
import { adminCopy } from "@/lib/admin/copy";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  initialVideos: VideoWorkRow[];
  categories: VideoCategoryRow[];
};

const emptyForm = {
  title_en: "",
  title_he: "",
  category_id: "",
  youtube_url: "",
  youtube_id: "",
  thumbnail_url: "",
  custom_cover_url: "",
  sort_order: 0,
  is_published: true,
};

export function VideosManager({ initialVideos, categories }: Props) {
  const router = useRouter();
  const videos = initialVideos;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );

  const parsedId = parseYoutubeId(form.youtube_url);
  const youtubeUrlInvalid =
    form.youtube_url.trim().length > 0 && parsedId === null;

  const filteredVideos = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return videos;
    return videos.filter((row) => {
      const cat = row.category_id ? categoryMap.get(row.category_id) : undefined;
      const categoryHaystack = cat
        ? `${cat.title_he} ${cat.title_en}`
        : "";
      const haystack = [
        row.title_en,
        row.title_he,
        categoryHaystack,
        row.youtube_url,
        row.youtube_id ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [videos, query, categoryMap]);

  function openCreate() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      category_id: categories[0]?.id ?? "",
    });
    setFormOpen(true);
    setError("");
    setSuccess("");
  }

  function openEdit(row: VideoWorkRow) {
    setEditingId(row.id);
    setForm({
      title_en: row.title_en,
      title_he: row.title_he,
      category_id: row.category_id ?? "",
      youtube_url: row.youtube_url,
      youtube_id: row.youtube_id ?? "",
      thumbnail_url: row.thumbnail_url ?? "",
      custom_cover_url: row.custom_cover_url ?? "",
      sort_order: row.sort_order,
      is_published: row.is_published,
    });
    setFormOpen(true);
    setError("");
    setSuccess("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!parsedId) {
      setError(adminCopy.videos.youtubeInvalidInline);
      return;
    }

    setLoading(true);

    const youtubeId = parsedId ?? form.youtube_id;
    const result = await saveVideoWork({
      id: editingId ?? undefined,
      title_en: form.title_en,
      title_he: form.title_he,
      category_id: form.category_id || null,
      youtube_url: form.youtube_url,
      youtube_id: youtubeId,
      thumbnail_url:
        form.thumbnail_url ||
        (youtubeId ? youtubeThumbnailUrl(youtubeId) : null),
      custom_cover_url: form.custom_cover_url || null,
      sort_order: form.sort_order,
      is_published: form.is_published,
    });

    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(editingId ? adminCopy.videos.updated : adminCopy.videos.created);
    setFormOpen(false);
    router.refresh();
  }

  async function handleToggle(id: string, published: boolean) {
    const result = await toggleVideoPublished(id, published);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteVideoWork(deleteId);
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
        <p className="text-sm text-slate-400">{adminCopy.videos.intro}</p>
        <button type="button" className={adminBtnPrimary} onClick={openCreate}>
          {adminCopy.videos.add}
        </button>
      </div>

      <AdminAlert variant="error" message={error} />
      <AdminAlert variant="success" message={success} />

      {formOpen && (
        <form onSubmit={handleSave} className={`${adminCardClass} space-y-4`}>
          <h2 className="text-lg font-semibold text-white">
            {editingId ? adminCopy.videos.edit : adminCopy.videos.new}
          </h2>
          <div className="flex flex-wrap gap-6">
            <YouTubePreview
              youtubeId={parsedId ?? form.youtube_id}
              customCoverUrl={form.custom_cover_url}
              title={form.title_en}
            />
            <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2">
              <AdminFormField
                label={adminCopy.videos.titleEn}
                name="title_en"
                dir="ltr"
                value={form.title_en}
                required
                onChange={(v) => setForm((f) => ({ ...f, title_en: v }))}
              />
              <AdminFormField
                label={adminCopy.videos.titleHe}
                name="title_he"
                dir="rtl"
                value={form.title_he}
                required
                onChange={(v) => setForm((f) => ({ ...f, title_he: v }))}
              />
              <AdminFormField
                as="select"
                label={adminCopy.videos.category}
                name="category_id"
                value={form.category_id}
                onChange={(v) => setForm((f) => ({ ...f, category_id: v }))}
                options={[
                  { value: "", label: adminCopy.actions.none },
                  ...categories.map((c) => ({
                    value: c.id,
                    label: categoryAdminLabel(c),
                  })),
                ]}
              />
              <AdminFormField
                label={adminCopy.videos.youtubeUrl}
                name="youtube_url"
                dir="ltr"
                value={form.youtube_url}
                required
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    youtube_url: v,
                    youtube_id: parseYoutubeId(v) ?? "",
                  }))
                }
                hint={
                  parsedId
                    ? adminCopy.videos.youtubeDetected(parsedId)
                    : youtubeUrlInvalid
                      ? adminCopy.videos.youtubeInvalidInline
                      : adminCopy.videos.youtubeHint
                }
              />
              <AdminFormField
                label={adminCopy.videos.customCover}
                name="custom_cover_url"
                dir="ltr"
                value={form.custom_cover_url}
                onChange={(v) => setForm((f) => ({ ...f, custom_cover_url: v }))}
              />
              <SortOrderField
                value={form.sort_order}
                onChange={(v) => setForm((f) => ({ ...f, sort_order: v }))}
              />
              <label className="flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_published: e.target.checked }))
                  }
                />
                {adminCopy.publish.published}
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className={adminBtnPrimary}
              disabled={loading || youtubeUrlInvalid}
            >
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

      {videos.length === 0 ? (
        <AdminEmptyState
          title={adminCopy.videos.emptyTitle}
          description={adminCopy.videos.emptyDesc}
          action={
            <button type="button" className={adminBtnPrimary} onClick={openCreate}>
              {adminCopy.videos.add}
            </button>
          }
        />
      ) : (
        <>
          <AdminSearchField value={query} onChange={setQuery} />
          {filteredVideos.length === 0 ? (
            <AdminEmptyState title={adminCopy.search.noResults} />
          ) : (
        <div className={`${adminCardClass} overflow-x-auto`}>
          <table className={adminTableClass}>
            <thead>
              <tr>
                <th className={adminThClass}>{adminCopy.videos.tablePreview}</th>
                <th className={adminThClass}>{adminCopy.videos.tableTitle}</th>
                <th className={adminThClass}>{adminCopy.videos.tableCategory}</th>
                <th className={adminThClass}>{adminCopy.categories.tableOrder}</th>
                <th className={adminThClass}>{adminCopy.categories.tableStatus}</th>
                <th className={adminThClass}>{adminCopy.categories.tableActions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredVideos.map((row) => (
                <tr key={row.id}>
                  <td className={adminTdClass}>
                    <YouTubePreview
                      youtubeId={row.youtube_id}
                      customCoverUrl={row.custom_cover_url}
                      title={row.title_en}
                      className="h-14 w-24"
                    />
                  </td>
                  <td className={adminTdClass}>{row.title_en}</td>
                  <td className={adminTdClass}>
                    {row.category_id
                      ? categoryAdminPrimary(
                          categoryMap.get(row.category_id) ?? {
                            title_he: "-",
                            title_en: "",
                          },
                        )
                      : "-"}
                  </td>
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
        </>
      )}

      <DeleteConfirmDialog
        open={Boolean(deleteId)}
        title={adminCopy.videos.deleteTitle}
        message={adminCopy.videos.deleteMessage}
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
