import Image, { type ImageProps } from "next/image";
import { canOptimizeImageSrc } from "@/lib/images/can-optimize-src";
import { cn } from "@/lib/utils";

type CdnImageProps = Omit<ImageProps, "src"> & { src: string };

/**
 * Public photos go through Next.js / Vercel Image Optimization (edge CDN + AVIF/WebP).
 * Blob/data previews stay on a native img.
 */
export function CdnImage({ src, alt, className, ...rest }: CdnImageProps) {
  if (!canOptimizeImageSrc(src)) {
    const fill = Boolean(rest.fill);
    return (
      // eslint-disable-next-line @next/next/no-img-element -- local blob/data preview
      <img
        src={src}
        alt={alt}
        className={cn(
          fill && "absolute inset-0 h-full w-full object-cover",
          className,
        )}
        decoding="async"
      />
    );
  }

  return <Image src={src} alt={alt} className={className} {...rest} />;
}
