import { getSiteUrl, resolveCrawlerOrigin } from "@/lib/seo/site-url";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = (await resolveCrawlerOrigin()) || getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api/"],
    },
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
