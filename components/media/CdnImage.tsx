"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type SyntheticEvent } from "react";
import { canOptimizeImageSrc } from "@/lib/images/can-optimize-src";
import { cn } from "@/lib/utils";

type CdnImageProps = Omit<ImageProps, "src"> & {
  src: string;
  /** When set, the parent controls when the photo becomes visible (e.g. reveal a group together). */
  revealed?: boolean;
};

/**
 * Public photos go through Next.js / Vercel Image Optimization (edge CDN + AVIF/WebP).
 * Shows a skeleton until the file is ready. Blob/data previews stay on a native img.
 */
export function CdnImage({
  src,
  alt,
  className,
  onLoad,
  onError,
  revealed,
  ...rest
}: CdnImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isPriority = Boolean(rest.priority);
  const loaded =
    revealed !== undefined
      ? revealed
      : isPriority || loadedSrc === src;
  const fill = Boolean(rest.fill);

  function handleLoad(event: SyntheticEvent<HTMLImageElement>) {
    setLoadedSrc(src);
    onLoad?.(event);
  }

  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    setLoadedSrc(src);
    onError?.(event);
  }

  const imageClassName = cn(
    "transition-opacity duration-300 ease-out",
    loaded ? "opacity-100" : "opacity-0",
    className,
  );

  const frameClassName = cn(
    "image-skeleton-frame overflow-hidden",
    fill ? "absolute inset-0" : "relative block w-full",
  );

  const skeleton = (
    <span
      aria-hidden
      className={cn(
        "image-skeleton pointer-events-none absolute inset-0",
        loaded && "opacity-0",
      )}
    />
  );

  if (!canOptimizeImageSrc(src)) {
    return (
      <span className={frameClassName}>
        {skeleton}
        {/* eslint-disable-next-line @next/next/no-img-element -- local blob/data preview */}
        <img
          src={src}
          alt={alt}
          className={cn(
            fill && "absolute inset-0 h-full w-full object-cover",
            imageClassName,
          )}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      </span>
    );
  }

  return (
    <span className={frameClassName}>
      {skeleton}
      <Image
        quality={70}
        {...rest}
        src={src}
        alt={alt}
        className={imageClassName}
        onLoad={handleLoad}
        onError={handleError}
      />
    </span>
  );
}
