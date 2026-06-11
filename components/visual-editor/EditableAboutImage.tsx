"use client";

import { uploadAboutImage } from "@/lib/admin/actions/media";
import { getAboutImageUrl } from "@/lib/i18n/about-image";
import { visualUploadMessages } from "@/lib/images/visual-upload-messages";
import {
  isAllowedStillImageFile,
  MAX_STILL_UPLOAD_BYTES,
  stillImageAcceptAttribute,
} from "@/lib/images/still-upload-validation";
import { useVisualEditorActive } from "@/components/visual-editor/VisualEditorProvider";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Props = {
  imageUrl: string | null;
  imageAlt: string;
  className?: string;
  /** Fill the parent height; show the full image anchored to the bottom. */
  fillHeight?: boolean;
};

export function EditableAboutImage({
  imageUrl,
  imageAlt,
  className,
  fillHeight = false,
}: Props) {
  const active = useVisualEditorActive();
  const { locale, cmsMap } = useLanguage();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const copy = visualUploadMessages(locale);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const displayUrl =
    previewUrl ?? imageUrl ?? getAboutImageUrl(cmsMap) ?? null;

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    setMessage("");

    if (!isAllowedStillImageFile(file)) {
      setError(copy.invalidType);
      return;
    }
    if (file.size > MAX_STILL_UPLOAD_BYTES) {
      setError(copy.tooLarge);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadAboutImage(formData);
    setUploading(false);

    if (!result.success) {
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(null);
      setError(result.error || copy.aboutUploadFailed);
      return;
    }

    if (result.data?.url) {
      setPreviewUrl(result.data.url);
    }
    setMessage(copy.aboutSaved);
    router.refresh();
  }

  return (
    <div
      className={cn(
        fillHeight
          ? "relative h-full w-full overflow-hidden rounded-2xl"
          : "relative mx-auto aspect-[4/5] w-full max-h-[280px] max-w-[240px] overflow-hidden rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.1)] ring-1 ring-cyan-400/15 sm:max-h-[300px] sm:max-w-[260px] lg:mx-0 lg:max-h-[320px] lg:max-w-none",
        className,
      )}
      role="img"
      aria-label={imageAlt}
    >
      {displayUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayUrl}
          alt={imageAlt}
          className={cn(
            "absolute inset-0 h-full w-full",
            fillHeight ? "object-cover object-center" : "object-cover",
          )}
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/35 via-slate-900/55 to-[#070b14]" />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(56,189,248,0.12),transparent_60%)]"
            aria-hidden
          />
        </>
      )}
      {active ? (
        <div className="absolute inset-0 flex items-end justify-center bg-black/40 p-3 opacity-0 transition hover:opacity-100 focus-within:opacity-100">
          <label
            className={cn(
              "cursor-pointer rounded-lg border border-cyan-400/50 bg-slate-950/80 px-3 py-2 text-xs font-medium text-cyan-100 backdrop-blur-sm",
              uploading && "pointer-events-none opacity-60",
            )}
          >
            {uploading ? copy.uploading : copy.changeAboutImage}
            <input
              ref={fileRef}
              type="file"
              accept={stillImageAcceptAttribute()}
              className="sr-only"
              disabled={uploading}
              onChange={(e) => void handleFile(e)}
            />
          </label>
        </div>
      ) : null}
      {message ? (
        <p
          className="absolute bottom-14 left-2 right-2 rounded bg-emerald-950/90 px-2 py-1 text-center text-xs text-emerald-300"
          role="status"
        >
          {message}
        </p>
      ) : null}
      {error ? (
        <p
          className="absolute bottom-14 left-2 right-2 rounded bg-red-950/90 px-2 py-1 text-center text-xs text-red-300"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
