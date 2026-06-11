"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { uploadAboutExtendedImage } from "@/lib/admin/actions/media";
import { getAboutExtendedImageUrl } from "@/lib/i18n/about-image";
import {
  isAllowedStillImageFile,
  MAX_STILL_UPLOAD_BYTES,
  stillImageAcceptAttribute,
} from "@/lib/images/still-upload-validation";
import { adminCopy, adminErrors } from "@/lib/admin/copy";
import type { SiteContentItem } from "@/types/content";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

type Props = {
  content: SiteContentItem[];
};

export function AboutExtendedImageUpload({ content }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const cmsMap = useMemo(
    () => Object.fromEntries(content.map((r) => [r.key, r])),
    [content],
  );
  const currentUrl = getAboutExtendedImageUrl(cmsMap);

  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const displayUrl = previewUrl ?? currentUrl;

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    setSuccess("");

    if (!isAllowedStillImageFile(file)) {
      setError(adminErrors.invalidImageType);
      return;
    }
    if (file.size > MAX_STILL_UPLOAD_BYTES) {
      setError(adminErrors.imageTooLarge);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadAboutExtendedImage(formData);
    setUploading(false);

    if (!result.success) {
      setError(result.error || adminErrors.aboutUploadFailed);
      return;
    }

    if (result.data?.url) {
      setPreviewUrl(result.data.url);
    }
    setSuccess(adminCopy.content.aboutExtendedImageSaved);
    router.refresh();
  }

  return (
    <div className="space-y-3 border-b border-blue-950/60 pb-6">
      <h3 className="text-base font-semibold text-white">
        {adminCopy.content.aboutExtendedImageTitle}
      </h3>
      <AdminAlert variant="error" message={error} />
      <AdminAlert variant="success" message={success} />
      {displayUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayUrl}
          alt={adminCopy.content.aboutExtendedImageTitle}
          className="max-h-56 w-full max-w-md rounded-lg border border-blue-900/40 object-cover"
        />
      ) : (
        <p className="text-sm text-slate-500">
          {adminCopy.content.aboutImageNoPreview}
        </p>
      )}
      <label className="inline-block">
        <span className="sr-only">{adminCopy.content.aboutExtendedImageReplace}</span>
        <input
          ref={fileRef}
          type="file"
          accept={stillImageAcceptAttribute()}
          disabled={uploading}
          onChange={(e) => void handleFile(e)}
          className="text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:text-white"
        />
      </label>
      <p className="text-xs text-slate-500">
        {uploading
          ? adminCopy.content.aboutImageUploading
          : adminCopy.content.aboutExtendedImageReplace}
      </p>
    </div>
  );
}
