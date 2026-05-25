"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { uploadAboutImage } from "@/lib/admin/actions/media";
import { getAboutImageUrl } from "@/lib/i18n/about-image";
import {
  isAllowedImageType,
  MAX_STILL_UPLOAD_BYTES,
} from "@/lib/images/get-image-dimensions";
import { adminCopy, adminErrors } from "@/lib/admin/copy";
import type { SiteContentItem } from "@/types/content";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

type Props = {
  content: SiteContentItem[];
};

export function AboutImageUpload({ content }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const cmsMap = useMemo(
    () => Object.fromEntries(content.map((r) => [r.key, r])),
    [content],
  );
  const currentUrl = getAboutImageUrl(cmsMap);

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

    if (!isAllowedImageType(file.type)) {
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

    const result = await uploadAboutImage(formData);
    setUploading(false);

    if (!result.success) {
      setError(result.error || adminErrors.aboutUploadFailed);
      return;
    }

    if (result.data?.url) {
      setPreviewUrl(result.data.url);
    }
    setSuccess(adminCopy.content.aboutImageSaved);
    router.refresh();
  }

  return (
    <div className="space-y-3 border-b border-blue-950/60 pb-6">
      <h3 className="text-base font-semibold text-white">
        {adminCopy.content.aboutImageTitle}
      </h3>
      <AdminAlert variant="error" message={error} />
      <AdminAlert variant="success" message={success} />
      {displayUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayUrl}
          alt={adminCopy.content.aboutImageTitle}
          className="max-h-56 w-full max-w-xs rounded-lg border border-blue-900/40 object-cover"
        />
      ) : (
        <p className="text-sm text-slate-500">
          {adminCopy.content.aboutImageNoPreview}
        </p>
      )}
      <label className="inline-block">
        <span className="sr-only">{adminCopy.content.aboutImageReplace}</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => void handleFile(e)}
          className="text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:text-white"
        />
      </label>
      <p className="text-xs text-slate-500">
        {uploading
          ? adminCopy.content.aboutImageUploading
          : adminCopy.content.aboutImageReplace}
      </p>
    </div>
  );
}
