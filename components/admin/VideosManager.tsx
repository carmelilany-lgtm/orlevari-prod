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

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c.title_en])),
    [categories],
  );

  const parsedId = parseYoutubeId(form.youtube_url);

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
    setLoading(true);
    setError("");
    setSuccess("");

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

    setSuccess(editingId ? "Video updated." : "Video created.");
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
        <p className="text-sm text-slate-400">Manage YouTube portfolio videos.</p>
        <button type="button" className={adminBtnPrimary} onClick={openCreate}>
          Add video
        </button>
      </div>

      <AdminAlert variant="error" message={error} />
      <AdminAlert variant="success" message={success} />

      {formOpen && (
        <form onSubmit={handleSave} className={`${adminCardClass} space-y-4`}>
          <h2 className="text-lg font-semibold text-white">
            {editingId ? "Edit video" : "New video"}
          </h2>
          <div className="flex flex-wrap gap-6">
            <YouTubePreview
              youtubeId={parsedId ?? form.youtube_id}
              customCoverUrl={form.custom_cover_url}
              title={form.title_en}
            />
            <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2">
              <AdminFormField
                label="Title (English)"
                name="title_en"
                value={form.title_en}
                required
                onChange={(v) => setForm((f) => ({ ...f, title_en: v }))}
              />
              <AdminFormField
                label="Title (Hebrew)"
                name="title_he"
                value={form.title_he}
                required
                onChange={(v) => setForm((f) => ({ ...f, title_he: v }))}
              />
              <AdminFormField
                as="select"
                label="Category"
                name="category_id"
                value={form.category_id}
                onChange={(v) => setForm((f) => ({ ...f, category_id: v }))}
                options={[
                  { value: "", label: "— None —" },
                  ...categories.map((c) => ({
                    value: c.id,
                    label: c.title_en,
                  })),
                ]}
              />
              <AdminFormField
                label="YouTube URL"
                name="youtube_url"
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
                    ? `Detected ID: ${parsedId}`
                    : "Paste a valid YouTube link"
                }
              />
              <AdminFormField
                label="Custom cover URL (optional)"
                name="custom_cover_url"
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
                Published
              </label>
            </div>
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

      {videos.length === 0 ? (
        <AdminEmptyState
          title="No videos yet."
          description="Add your first YouTube video to the portfolio."
          action={
            <button type="button" className={adminBtnPrimary} onClick={openCreate}>
              Add video
            </button>
          }
        />
      ) : (
        <div className={`${adminCardClass} overflow-x-auto`}>
          <table className={adminTableClass}>
            <thead>
              <tr>
                <th className={adminThClass}>Preview</th>
                <th className={adminThClass}>Title</th>
                <th className={adminThClass}>Category</th>
                <th className={adminThClass}>Order</th>
                <th className={adminThClass}>Status</th>
                <th className={adminThClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((row) => (
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
                      ? categoryMap.get(row.category_id) ?? "—"
                      : "—"}
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
        title="Delete video?"
        message="This will permanently remove the video from the portfolio."
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
