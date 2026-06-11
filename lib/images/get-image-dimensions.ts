import {
  isAllowedStillImageFile,
  MAX_STILL_UPLOAD_BYTES,
  resolveImageMime,
} from "@/lib/images/still-upload-validation";

export { MAX_STILL_UPLOAD_BYTES } from "@/lib/images/still-upload-validation";

export type ImageDimensions = {
  width: number;
  height: number;
  aspectRatio: number;
};

/** Read natural dimensions from a File in the browser */
export function getImageDimensionsFromFile(
  file: File,
): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      URL.revokeObjectURL(url);
      if (!width || !height) {
        reject(new Error("Could not read image dimensions."));
        return;
      }
      resolve({
        width,
        height,
        aspectRatio: width / height,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for dimension detection."));
    };

    img.src = url;
  });
}

/** @deprecated Prefer isAllowedStillImageFile(file) for uploads */
export function isAllowedImageType(type: string, fileName = ""): boolean {
  return resolveImageMime(type, fileName) != null;
}

export { isAllowedStillImageFile, resolveImageMime };
