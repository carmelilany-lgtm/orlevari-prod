"use client";

import { visualUploadMessages } from "@/lib/images/visual-upload-messages";
import type { Locale } from "@/types/i18n";
import { useCallback, useState } from "react";
import {
  runStillBatchUpload,
  type StillBatchUploadProgress,
} from "@/lib/images/still-batch-upload-client";

export type { StillBatchUploadProgress };

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

      setError("");
      setSuccess("");
      setUploading(true);
      setProgress(null);

      try {
        const result = await runStillBatchUpload({
          files,
          messages: {
            invalidType: copy.invalidType,
            tooLarge: copy.tooLarge,
            uploadFailed: copy.uploadFailed,
            dimensionsUnreadable: copy.dimensionsUnreadable,
            maxFiles: copy.maxFiles,
          },
          concurrency: 3,
          onProgress: setProgress,
        });

        if (result.succeeded > 0 && result.failed === 0 && result.skipped === 0) {
          setSuccess(copy.addedSuccess);
        } else if (result.succeeded > 0) {
          setSuccess(copy.uploadSummary(result.succeeded, files.length));
          if (result.failed > 0 || result.skipped > 0) {
            setError(result.errors[0] ?? copy.uploadFailed);
          }
        } else {
          setError(result.errors[0] ?? copy.uploadFailed);
        }

        return { succeeded: result.succeeded, failed: result.failed + result.skipped };
      } catch {
        setError(copy.uploadFailed);
        return { succeeded: 0, failed: files.length };
      } finally {
        setUploading(false);
        setProgress(null);
      }
    },
    [copy],
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
