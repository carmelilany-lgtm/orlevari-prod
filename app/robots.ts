import { getSiteUrl } from "@/lib/seo/site-url";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
