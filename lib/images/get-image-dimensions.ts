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

export const MAX_STILL_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB — matches bucket limit

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export function isAllowedImageType(type: string): boolean {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type);
}
