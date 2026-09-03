import sharp from "sharp";

/** Longest edge stored in Supabase - Vercel then serves even smaller tiles. */
export const MAX_PUBLIC_IMAGE_EDGE = 1280;

export type OptimizedUpload = {
  buffer: Buffer;
  contentType: "image/webp";
  fileName: string;
  width: number;
  height: number;
};

/**
 * Resize and encode camera originals so the image CDN is not fetching 3-10MB files.
 */
export async function optimizeImageForPublicStorage(
  input: ArrayBuffer,
): Promise<OptimizedUpload> {
  const pipeline = sharp(Buffer.from(input), { failOn: "none" }).rotate();
  const resized = pipeline.resize(MAX_PUBLIC_IMAGE_EDGE, MAX_PUBLIC_IMAGE_EDGE, {
    fit: "inside",
    withoutEnlargement: true,
  });
  const buffer = await resized.webp({ quality: 72, effort: 4 }).toBuffer();
  const meta = await sharp(buffer).metadata();

  return {
    buffer,
    contentType: "image/webp",
    fileName: "image.webp",
    width: meta.width ?? MAX_PUBLIC_IMAGE_EDGE,
    height: meta.height ?? MAX_PUBLIC_IMAGE_EDGE,
  };
}
