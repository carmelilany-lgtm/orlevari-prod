"use client";

import {
  getNextStillSortOrder,
  uploadStillImage,
} from "@/lib/admin/actions/stills";
import { getImageDimensionsFromFile } from "@/lib/images/get-image-dimensions";
import {
  MAX_BULK_STILL_UPLOAD_FILES,
  validateStillImageFile,
  type StillImageValidationError,
} from "@/lib/images/still-upload-validation";

export type StillBatchUploadProgress = {
  current: number;
  total: number;
  succeeded: number;
  failed: number;
} | null;

export type StillBatchUploadMessages = {
  invalidType: string;
  tooLarge: string;
  uploadFailed: string;
  dimensionsUnreadable: string;
  maxFiles: (max: number) => string;
};

export type StillBatchUploadOptions = {
  files: FileList | File[];
  altEn?: string;
  altHe?: string;
  isPublished?: boolean;
  messages: StillBatchUploadMessages;
  concurrency?: number;
  onProgress?: (progress: StillBatchUploadProgress) => void;
};

export type StillBatchUploadResult = {
  succeeded: number;
  failed: number;
  skipped: number;
  errors: string[];
};

function validationMessage(
  error: StillImageValidationError,
  messages: StillBatchUploadMessages,
): string {
  if (error === "invalid_type") return messages.invalidType;
  return messages.tooLarge;
}

async function uploadOneStill(
  file: File,
  index: number,
  batchTimestamp: number,
  sortOrder: number,
  altEn: string,
  altHe: string,
  isPublished: boolean,
  dimensionsUnreadable: string,
): Promise<{ ok: true; warning?: string } | { ok: false; error: string }> {
  let width: number | null = null;
  let height: number | null = null;
  let aspectRatio: number | null = null;

  let dimsWarning: string | undefined;
  try {
    const dims = await getImageDimensionsFromFile(file);
    width = dims.width;
    height = dims.height;
    aspectRatio = dims.aspectRatio;
  } catch {
    // Upload without dimensions when detection fails
    dimsWarning = dimensionsUnreadable;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("batch_timestamp", String(batchTimestamp));
  formData.append("file_index", String(index));
  if (width != null) formData.append("width", String(width));
  if (height != null) formData.append("height", String(height));
  if (aspectRatio != null) {
    formData.append("aspect_ratio", String(aspectRatio));
  }
  formData.append("alt_en", altEn);
  formData.append("alt_he", altHe);
  formData.append("sort_order", String(sortOrder));
  formData.append("is_published", isPublished ? "true" : "false");

  const result = await uploadStillImage(formData);
  if (!result.success) {
    return { ok: false, error: result.error || "" };
  }
  return dimsWarning ? { ok: true, warning: dimsWarning } : { ok: true };
}

/** Upload still images with per-file validation and limited concurrency. */
export async function runStillBatchUpload(
  options: StillBatchUploadOptions,
): Promise<StillBatchUploadResult> {
  const {
    files: fileList,
    altEn = "",
    altHe = "",
    isPublished = true,
    messages,
    concurrency = 3,
    onProgress,
  } = options;

  const files = Array.from(fileList);
  if (files.length === 0) {
    return { succeeded: 0, failed: 0, skipped: 0, errors: [] };
  }

  const selectedTotal = files.length;

  if (files.length > MAX_BULK_STILL_UPLOAD_FILES) {
    return {
      succeeded: 0,
      failed: files.length,
      skipped: files.length,
      errors: [messages.maxFiles(MAX_BULK_STILL_UPLOAD_FILES)],
    };
  }

  const validFiles: File[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const check = validateStillImageFile(file);
    if (!check.ok) {
      errors.push(`${file.name}: ${validationMessage(check.error, messages)}`);
      continue;
    }
    validFiles.push(file);
  }

  if (validFiles.length === 0) {
    return {
      succeeded: 0,
      failed: files.length,
      skipped: files.length - validFiles.length,
      errors,
    };
  }

  const sortBaseResult = await getNextStillSortOrder();
  if (!sortBaseResult.success || sortBaseResult.data == null) {
    const err = sortBaseResult.success ? messages.uploadFailed : sortBaseResult.error;
    return {
      succeeded: 0,
      failed: validFiles.length,
      skipped: files.length - validFiles.length,
      errors: [err, ...errors],
    };
  }

  let nextSortOrder = sortBaseResult.data;
  const batchTimestamp = Date.now();
  let succeeded = 0;
  let failed = 0;
  let completed = 0;

  onProgress?.({
    current: 0,
    total: selectedTotal,
    succeeded: 0,
    failed: 0,
  });

  const queue = validFiles.map((file, index) => ({ file, index }));

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;

      const sortOrder = nextSortOrder++;
      const result = await uploadOneStill(
        item.file,
        item.index,
        batchTimestamp,
        sortOrder,
        altEn,
        altHe,
        isPublished,
        messages.dimensionsUnreadable,
      );

      if (result.ok) {
        succeeded += 1;
        if (result.warning) errors.push(result.warning);
      } else {
        failed += 1;
        errors.push(
          `${item.file.name}: ${result.error || messages.uploadFailed}`,
        );
      }

      completed += 1;
      onProgress?.({
        current: completed,
        total: selectedTotal,
        succeeded,
        failed,
      });
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, validFiles.length) },
    () => worker(),
  );
  await Promise.all(workers);

  return {
    succeeded,
    failed,
    skipped: files.length - validFiles.length,
    errors,
  };
}
