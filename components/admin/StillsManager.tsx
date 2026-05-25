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
} from "@/components/admin/admin-styles";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { PublishToggle } from "@/components/admin/PublishToggle";
import {
  deleteStillImage,
  saveStillImageMeta,
  toggleStillPublished,
  uploadStillImage,
  type StillImageRow,
} from "@/lib/admin/actions/stills";
import {
  getImageDimensionsFromFile,
  isAllowedImageType,
  MAX_STILL_UPLOAD_BYTES,
} from "@/lib/images/get-image-dimensions";
import { adminCopy, adminErrors } from "@/lib/admin/copy";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

type Props = {
  initialStills: StillImageRow[];
};

export function StillsManager({ initialStills }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const stills = initialStills;
  const [editing, setEditing] = useState<StillImageRow | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [altEn, setAltEn] = useState("");
  const [altHe, setAltHe] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [query, setQuery] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const filteredStills = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stills;
    return stills.filter((row) => {
      const haystack = [row.alt_en ?? "", row.alt_he ?? "", row.image_url]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [stills, query]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
    void handleUpload(e);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");

    if (!isAllowedImageType(file.type)) {
      setError(adminErrors.invalidImageType);
      return;
    }
    if (file.size > MAX_STILL_UPLOAD_BYTES) {
      setError(adminErrors.imageTooLarge);
      return;
    }

    setUploading(true);
    try {
      const dims = await getImageDimensionsFromFile(file);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("width", String(dims.width));
      formData.append("height", String(dims.height));
      formData.append("aspect_ratio", String(dims.aspectRatio));
      formData.append("alt_en", altEn);
      formData.append("alt_he", altHe);
      formData.append("sort_order", String(sortOrder));
      formData.append("is_published", published ? "true" : "false");

      const result = await uploadStillImage(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess(adminCopy.stills.uploaded);
      if (fileRef.current) fileRef.current.value = "";
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      router.refresh();
    } catch {
      setError(
        `${adminErrors.processUploadFailed} ${adminCopy.stills.uploadFailedHint}`,
      );
    } finally {
      setUploading(false);
    }
  }

  function startEdit(row: StillImageRow) {
    setEditing(row);
    setAltEn(row.alt_en ?? "");
    setAltHe(row.alt_he ?? "");
    setSortOrder(row.sort_order);
    setPublished(row.is_published);
  }

  async function handleSaveMeta(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);
    setError("");
    const result = await saveStillImageMeta({
      id: editing.id,
      alt_en: altEn,
      alt_he: altHe,
      sort_order: sortOrder,
      is_published: published,
    });
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setSuccess(adminCopy.stills.updated);
    setEditing(null);
    router.refresh();
  }

  async function handleToggle(id: string, is_published: boolean) {
    const result = await toggleStillPublished(id, is_published);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteStillImage(deleteId);
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
      <AdminAlert variant="error" message={error} />
      <AdminAlert variant="success" message={success} />

      <div className={`${adminCardClass} space-y-4`}>
        <h2 className="text-lg font-semibold text-white">
          {adminCopy.stills.uploadTitle}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminFormField
            label={adminCopy.stills.altEn}
            name="upload_alt_en"
            dir="ltr"
            value={altEn}
            onChange={setAltEn}
          />
          <AdminFormField
            label={adminCopy.stills.altHe}
            name="upload_alt_he"
            dir="rtl"
            value={altHe}
            onChange={setAltHe}
          />
          <AdminFormField
            label={adminCopy.stills.sortOrder}
            name="upload_sort"
            type="number"
            value={sortOrder}
            onChange={(v) => setSortOrder(Number(v) || 0)}
          />
          <label className="flex items-end gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            {adminCopy.actions.publishOnUpload}
          </label>
        </div>
        {previewUrl && !uploading && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={adminCopy.stills.uploadTitle}
            className="max-h-40 rounded-lg border border-blue-900/40 object-contain"
          />
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={uploading}
          aria-busy={uploading}
          className="text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:text-white"
        />
        {uploading && (
          <div className="space-y-2" role="status" aria-live="polite">
            <p className="text-sm text-blue-300">{adminCopy.stills.uploading}</p>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-blue-950"
              role="progressbar"
              aria-valuetext={adminCopy.stills.uploading}
            >
              <div className="h-full w-1/3 animate-pulse rounded-full bg-blue-500" />
            </div>
          </div>
        )}
      </div>

      {editing && (
        <form onSubmit={handleSaveMeta} className={`${adminCardClass} space-y-4`}>
          <h2 className="text-lg font-semibold text-white">
            {adminCopy.stills.editTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField
              label={adminCopy.stills.altEn}
              dir="ltr"
              value={altEn}
              onChange={setAltEn}
            />
            <AdminFormField
              label={adminCopy.stills.altHe}
              dir="rtl"
              value={altHe}
              onChange={setAltHe}
            />
            <AdminFormField
              label={adminCopy.stills.sortOrder}
              type="number"
              value={sortOrder}
              onChange={(v) => setSortOrder(Number(v) || 0)}
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className={adminBtnPrimary} disabled={loading}>
              {adminCopy.actions.save}
            </button>
            <button
              type="button"
              className={adminBtnSecondary}
              onClick={() => setEditing(null)}
            >
              {adminCopy.actions.cancel}
            </button>
          </div>
        </form>
      )}

      {stills.length === 0 ? (
        <AdminEmptyState
          title={adminCopy.stills.emptyTitle}
          description={adminCopy.stills.emptyDesc}
        />
      ) : (
        <>
          <AdminSearchField value={query} onChange={setQuery} />
          {filteredStills.length === 0 ? (
            <AdminEmptyState title={adminCopy.search.noResults} />
          ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStills.map((row) => (
            <div key={row.id} className={`${adminCardClass} space-y-3`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={row.image_url}
                alt={row.alt_en ?? "תמונה"}
                className="max-h-48 w-full rounded-lg object-contain bg-black/20"
              />
              <p className="text-xs text-slate-500">
                {row.width && row.height
                  ? `${row.width} × ${row.height}`
                  : adminCopy.stills.dimensionsUnknown}
                {row.aspect_ratio != null &&
                  ` · ${adminCopy.stills.ratio(Number(row.aspect_ratio))}`}
              </p>
              <PublishToggle
                published={row.is_published}
                onToggle={(p) => handleToggle(row.id, p)}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  className={adminBtnSecondary}
                  onClick={() => startEdit(row)}
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
            </div>
          ))}
        </div>
          )}
        </>
      )}

      <DeleteConfirmDialog
        open={Boolean(deleteId)}
        title={adminCopy.stills.deleteTitle}
        message={adminCopy.stills.deleteMessage}
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
