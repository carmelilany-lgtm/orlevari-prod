import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const BRAND_LOGO_SRC = "/brand/levari-productions-logo.png";
export const BRAND_LOGO_WIDTH = 1024;
export const BRAND_LOGO_HEIGHT = 226;

type BrandLogoProps = {
  alt: string;
  className?: string;
  heightClassName?: string;
  sizes?: string;
  priority?: boolean;
};

export function BrandLogo({
  alt,
  className,
  heightClassName = "h-9 sm:h-10",
  sizes = "220px",
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src={BRAND_LOGO_SRC}
      alt={alt}
      width={BRAND_LOGO_WIDTH}
      height={BRAND_LOGO_HEIGHT}
      priority={priority}
      sizes={sizes}
      className={cn(
        "w-auto max-w-[min(100%,12rem)] sm:max-w-[14rem]",
        heightClassName,
        className,
      )}
    />
  );
}

export const HERO_BRAND_LOGO_ID = "hero-brand-logo";

type BrandLogoLinkProps = BrandLogoProps & {
  href: string;
  id?: string;
  imageClassName?: string;
};

export function BrandLogoLink({
  href,
  alt,
  className,
  imageClassName,
  heightClassName,
  sizes,
  priority,
  id,
}: BrandLogoLinkProps) {
  const linkClass = cn(
    "inline-flex shrink-0 items-center rounded-sm",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400",
    className,
  );
  const logo = (
    <BrandLogo
      alt={alt}
      className={imageClassName}
      heightClassName={heightClassName}
      sizes={sizes}
      priority={priority}
    />
  );

  if (href.startsWith("#")) {
    return (
      <a id={id} href={href} className={linkClass} dir="ltr">
        {logo}
      </a>
    );
  }

  return (
    <Link id={id} href={href} className={linkClass} dir="ltr">
      {logo}
    </Link>
  );
}
