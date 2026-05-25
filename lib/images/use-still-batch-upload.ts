"use client";

import {
  getNextStillSortOrder,
  uploadStillImage,
} from "@/lib/admin/actions/stills";
import {
  getImageDimensionsFromFile,
  isAllowedImageType,
  MAX_STILL_UPLOAD_BYTES,
} from "@/lib/images/get-image-dimensions";
import {
  MAX_BULK_STILL_UPLOAD_FILES,
  STILL_UPLOAD_CONCURRENCY,
} from "@/lib/images/still-upload-constants";
import { mapWithConcurrency } from "@/lib/images/upload-batch";
import { visualUploadMessages } from "@/lib/images/visual-upload-messages";
import type { Locale } from "@/types/i18n";
import { useCallback, useState } from "react";

export type StillBatchUploadProgress = {
  current: number;
  total: number;
  succeeded: number;
  failed: number;
} | null;

const tooManyMessage: Record<Locale, string> = {
  he: "ניתן להעלות עד 40 תמונות בכל פעם.",
  en: "You can upload up to 40 images at a time.",
};

export function useStillBatchUpload(locale: Locale) {
  const copy = visualUploadMessages(locale);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<StillBatchUploadProgress>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const uploadFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      if (files.length === 0) return { succeeded: 0, failed: 0 };

      if (files.length > MAX_BULK_STILL_UPLOAD_FILES) {
        setError(tooManyMessage[locale]);
        return { succeeded: 0, failed: files.length };
      }

      setError("");
      setSuccess("");

      const validFiles: File[] = [];
      const skipped: string[] = [];

      for (const file of files) {
        if (!isAllowedImageType(file.type)) {
          skipped.push(`${file.name}: ${copy.invalidType}`);
          continue;
        }
        if (file.size > MAX_STILL_UPLOAD_BYTES) {
          skipped.push(`${file.name}: ${copy.tooLarge}`);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) {
        const msg = skipped[0] ?? copy.uploadFailed;
        setError(msg);
        return { succeeded: 0, failed: files.length };
      }

      const sortBaseResult = await getNextStillSortOrder();
      if (!sortBaseResult.success || sortBaseResult.data == null) {
        setError(
          sortBaseResult.success ? copy.uploadFailed : sortBaseResult.error,
        );
        return { succeeded: 0, failed: validFiles.length };
      }

      const nextSortOrder = sortBaseResult.data;
      const batchTimestamp = Date.now();

      setUploading(true);
      setProgress({
        current: 0,
        total: validFiles.length,
        succeeded: 0,
        failed: 0,
      });

      let succeeded = 0;
      let failed = 0;
      const uploadErrors: string[] = [...skipped];

      try {
        const outcomes = await mapWithConcurrency(
          validFiles,
          STILL_UPLOAD_CONCURRENCY,
          async (file, i) => {
            let width: number | null = null;
            let height: number | null = null;
            let aspectRatio: number | null = null;

            try {
              const dims = await getImageDimensionsFromFile(file);
              width = dims.width;
              height = dims.height;
              aspectRatio = dims.aspectRatio;
            } catch {
              // Allow upload without dimensions
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("batch_timestamp", String(batchTimestamp));
            formData.append("file_index", String(i));
            if (width != null) formData.append("width", String(width));
            if (height != null) formData.append("height", String(height));
            if (aspectRatio != null) {
              formData.append("aspect_ratio", String(aspectRatio));
            }
            formData.append("alt_en", "");
            formData.append("alt_he", "");
            formData.append("sort_order", String(nextSortOrder + i));
            formData.append("is_published", "true");

            const result = await uploadStillImage(formData);
            return { file, result };
          },
        );

        let completed = 0;
        for (const { file, result } of outcomes) {
          completed += 1;
          if (!result.success) {
            failed += 1;
            uploadErrors.push(
              `${file.name}: ${result.error || copy.uploadFailed}`,
            );
          } else {
            succeeded += 1;
          }
          setProgress({
            current: completed,
            total: validFiles.length,
            succeeded,
            failed,
          });
        }

        if (succeeded > 0 && failed === 0 && skipped.length === 0) {
          setSuccess(copy.addedSuccess);
        } else if (succeeded > 0) {
          setSuccess(copy.uploadSummary(succeeded, validFiles.length));
          if (failed > 0 || skipped.length > 0) {
            const failCount = failed + skipped.length;
            setError(
              locale === "he"
                ? `${failCount} תמונות לא הועלו. ניתן לנסות שוב.`
                : `${failCount} image(s) failed. You can try again.`,
            );
          }
        } else {
          setError(uploadErrors[0] ?? copy.uploadFailed);
        }

        return { succeeded, failed: failed + skipped.length };
      } catch {
        setError(copy.uploadFailed);
        return { succeeded: 0, failed: validFiles.length };
      } finally {
        setUploading(false);
        setProgress(null);
      }
    },
    [copy, locale],
  );

  return {
    uploading,
    progress,
    error,
    success,
    uploadFiles,
    copy,
  };
}
