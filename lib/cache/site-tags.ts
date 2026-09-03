/** Cache tags for public CMS/portfolio data and proxied storage files. */
export const SITE_CACHE_TAGS = {
  publicData: "site-public",
  media: "site-media",
} as const;

export const SITE_DATA_REVALIDATE_SECONDS = 60 * 60;
export const SITE_MEDIA_REVALIDATE_SECONDS = 60 * 60 * 24 * 30;
