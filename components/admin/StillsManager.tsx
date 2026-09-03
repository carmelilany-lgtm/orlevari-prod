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
import { CdnImage } from "@/components/media/CdnImage";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { PublishToggle } from "@/components/admin/PublishToggle";
import {
  deleteStillImage,
  saveStillImageMeta,
  toggleStillPublished,
  updateStillExcludeFromHero,
  type StillImageRow,
} from "@/lib/admin/actions/stills";
import { runStillBatchUpload } from "@/lib/images/still-batch-upload-client";
import {
  MAX_BULK_STILL_UPLOAD_FILES,
  stillImageAcceptAttribute,
} from "@/lib/images/still-upload-validation";
import { adminCopy, adminErrors } from "@/lib/admin/copy";
import Link from "next/link";
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
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    succeeded: number;
    failed: number;
  } | null>(null);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [altEn, setAltEn] = useState("");
  const [altHe, setAltHe] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [excludeFromHero, setExcludeFromHero] = useState(false);
  const [query, setQuery] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadMessages = useMemo(
    () => ({
      invalidType: adminErrors.invalidImageType,
      tooLarge: adminErrors.imageTooLarge,
      uploadFailed: adminErrors.stillUploadFailed,
      dimensionsUnreadable: adminErrors.dimensionsUnreadable,
      maxFiles: () => adminCopy.stills.uploadMaxBatch,
    }),
    [],
  );

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
    const files = e.target.files;
    if (!files?.length) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (files.length === 1) {
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setPreviewUrl(null);
    }
    void handleUpload(files);
    e.target.value = "";
  }

  async function handleUpload(fileList: FileList) {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    if (files.length > MAX_BULK_STILL_UPLOAD_FILES) {
      setError(adminCopy.stills.uploadMaxBatch);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setError("");
    setSuccess("");
    setFileErrors([]);
    setUploading(true);
    setUploadProgress({ current: 0, total: files.length, succeeded: 0, failed: 0 });

    try {
      const result = await runStillBatchUpload({
        files,
        altEn,
        altHe,
        isPublished: published,
        messages: uploadMessages,
        concurrency: 3,
        onProgress: setUploadProgress,
      });

      setFileErrors(result.errors);

      if (result.succeeded > 0 && result.failed === 0 && result.skipped === 0) {
        setSuccess(
          result.succeeded === 1
            ? adminCopy.stills.uploaded
            : adminCopy.stills.uploadedMany(result.succeeded),
        );
      } else if (result.succeeded > 0) {
        setSuccess(
          `${adminCopy.stills.uploadSummary(result.succeeded, files.length)}${
            result.failed + result.skipped > 0
              ? `. ${adminCopy.stills.uploadFailedCount(result.failed + result.skipped)}`
              : ""
          }`,
        );
        if (result.failed > 0 || result.skipped > 0) {
          setError(result.errors[0] ?? adminErrors.stillUploadPartialFailed);
        }
      } else {
        setError(
          result.errors[0] ??
            `${adminErrors.stillUploadFailed} ${adminCopy.stills.uploadRetryHint}`.trim(),
        );
      }

      if (fileRef.current) fileRef.current.value = "";
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);

      if (result.succeeded > 0) {
        router.refresh();
      }
    } catch (err) {
      console.error("[lev-ari] still upload batch:", err);
      const detail =
        err instanceof Error && err.message.includes("Body exceeded")
          ? adminErrors.imageTooLarge
          : adminErrors.processUploadFailed;
      setError(detail);
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }

  function startEdit(row: StillImageRow) {
    setEditing(row);
    setAltEn(row.alt_en ?? "");
    setAltHe(row.alt_he ?? "");
    setSortOrder(row.sort_order);
    setPublished(row.is_published);
    setExcludeFromHero(row.exclude_from_hero ?? false);
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
      exclude_from_hero: excludeFromHero,
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

  async function handleExcludeFromHeroToggle(
    id: string,
    exclude_from_hero: boolean,
  ) {
    const result = await updateStillExcludeFromHero(id, exclude_from_hero);
    if (!result.success) {
      setError(result.error);
      return;
    }
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
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Link href="/?editCollage=1#works" className={adminBtnSecondary}>
          {adminCopy.stills.collageLink}
        </Link>
      </div>

      <AdminAlert variant="error" message={error} />
      <AdminAlert variant="success" message={success} />

      <p className="text-sm text-slate-500">{adminCopy.stills.heroPageNote}</p>

      <div className={`${adminCardClass} space-y-4`}>
        <h2 className="text-lg font-semibold text-white">
          {adminCopy.stills.uploadTitle}
        </h2>
        <p className="text-sm text-slate-500">{adminCopy.stills.uploadHelper}</p>
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
        <label className="inline-block">
          <span className="sr-only">{adminCopy.stills.uploadChoose}</span>
          <input
            ref={fileRef}
            type="file"
            accept={stillImageAcceptAttribute()}
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            aria-busy={uploading}
            className="text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:text-white"
          />
        </label>
        <p className="text-xs text-slate-500">{adminCopy.stills.uploadChoose}</p>
        {uploading && uploadProgress && (
          <div className="space-y-2" role="status" aria-live="polite">
            <p className="text-sm text-blue-300">
              {adminCopy.stills.uploadingMany}
            </p>
            <p className="text-sm text-slate-300">
              {adminCopy.stills.uploadProgress(
                uploadProgress.current,
                uploadProgress.total,
              )}
            </p>
            <p className="text-xs text-slate-500">
              {adminCopy.stills.uploadSummary(
                uploadProgress.succeeded,
                uploadProgress.total,
              )}
              {uploadProgress.failed > 0
                ? ` · ${adminCopy.stills.uploadFailedCount(uploadProgress.failed)}`
                : ""}
            </p>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-blue-950"
              role="progressbar"
              aria-valuenow={uploadProgress.current}
              aria-valuemin={0}
              aria-valuemax={uploadProgress.total}
              aria-valuetext={adminCopy.stills.uploadProgress(
                uploadProgress.current,
                uploadProgress.total,
              )}
            >
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
        {fileErrors.length > 0 && !uploading && (
          <ul className="list-inside list-disc space-y-1 text-sm text-amber-400/90">
            {fileErrors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
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
            <label className="flex items-end gap-2 text-sm text-slate-300 sm:col-span-2">
              <input
                type="checkbox"
                checked={excludeFromHero}
                onChange={(e) => setExcludeFromHero(e.target.checked)}
              />
              {adminCopy.stills.excludeFromHero}
            </label>
          </div>
          <p className="text-xs text-slate-500">
            {adminCopy.stills.excludeFromHeroHint}
          </p>
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
              <div className="relative max-h-48 min-h-32 w-full overflow-hidden rounded-lg bg-black/20">
                <CdnImage
                  src={row.image_url}
                  alt={row.alt_en ?? "תמונה"}
                  width={row.width ?? 800}
                  height={row.height ?? 600}
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="max-h-48 w-full object-contain"
                />
              </div>
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
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={row.exclude_from_hero ?? false}
                  onChange={(e) =>
                    void handleExcludeFromHeroToggle(row.id, e.target.checked)
                  }
                />
                {adminCopy.stills.excludeFromHero}
              </label>
              <p className="text-xs text-slate-500">
                {adminCopy.stills.excludeFromHeroHint}
              </p>
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
