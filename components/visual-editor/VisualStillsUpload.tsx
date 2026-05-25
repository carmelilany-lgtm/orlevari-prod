"use client";

import { useStillBatchUpload } from "@/lib/images/use-still-batch-upload";
import { useVisualEditorActive } from "@/components/visual-editor/VisualEditorProvider";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export function VisualStillsUpload() {
  const active = useVisualEditorActive();
  const { locale } = useLanguage();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const { uploading, progress, error, success, uploadFiles, copy } =
    useStillBatchUpload(locale);

  if (!active) return null;

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    const result = await uploadFiles(files);
    e.target.value = "";
    if (result.succeeded > 0) {
      router.refresh();
    }
  }

  return (
    <div
      className="mb-6 rounded-xl border border-blue-500/30 bg-slate-900/50 p-4"
      dir={locale === "he" ? "rtl" : "ltr"}
      role="region"
      aria-label={copy.addToGallery}
    >
      <p className="text-sm font-semibold text-blue-100">{copy.addToGallery}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label
          className={cn(
            "inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          <span>{uploading ? copy.uploading : copy.chooseImages}</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            disabled={uploading}
            onChange={(e) => void handleChange(e)}
          />
        </label>
        {progress ? (
          <p className="text-sm text-slate-300" role="status" aria-live="polite">
            {copy.uploadingProgress(progress.current, progress.total)}
          </p>
        ) : null}
      </div>
      {success ? (
        <p className="mt-2 text-sm text-emerald-400" role="status">
          {success}
        </p>
      ) : null}
      {error ? (
        <p className="mt-2 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
