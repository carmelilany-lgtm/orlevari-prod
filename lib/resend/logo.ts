import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getSiteUrl } from "@/lib/seo/site-url";

export const EMAIL_LOGO_CONTENT_ID = "lev-ari-brand-logo";
export const EMAIL_LOGO_PUBLIC_PATH = "/brand/levari-productions-logo.png";

const LOGO_ON_DISK = join(
  process.cwd(),
  "public/brand/levari-productions-logo.png",
);

export type EmailLogoAttachment = {
  filename: string;
  contentId: string;
  contentType: string;
  content?: Buffer;
  path?: string;
};

function parseHttpsOrigin(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return undefined;
  try {
    const withProtocol = raw.includes("://") ? raw : `https://${raw}`;
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "https:") return undefined;
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      return undefined;
    }
    return parsed.origin;
  } catch {
    return undefined;
  }
}

/** Public HTTPS origin for email assets (never localhost). */
export function getEmailAssetOrigin(): string | undefined {
  return (
    parseHttpsOrigin(getSiteUrl()) ??
    parseHttpsOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  );
}

export function getEmailLogoHttpsUrl(): string | undefined {
  const origin = getEmailAssetOrigin();
  if (!origin) return undefined;
  return `${origin}${EMAIL_LOGO_PUBLIC_PATH}`;
}

export function readEmailLogoAttachment(): EmailLogoAttachment | null {
  try {
    const content = readFileSync(LOGO_ON_DISK);
    if (!content.length) return null;
    return {
      filename: "levari-productions-logo.png",
      content,
      contentId: EMAIL_LOGO_CONTENT_ID,
      contentType: "image/png",
    };
  } catch {
    const path = getEmailLogoHttpsUrl();
    if (!path) return null;
    return {
      filename: "levari-productions-logo.png",
      path,
      contentId: EMAIL_LOGO_CONTENT_ID,
      contentType: "image/png",
    };
  }
}

export function resolveEmailLogoSrc(inline: boolean): string | undefined {
  if (inline && readEmailLogoAttachment()) {
    return `cid:${EMAIL_LOGO_CONTENT_ID}`;
  }
  return getEmailLogoHttpsUrl();
}
