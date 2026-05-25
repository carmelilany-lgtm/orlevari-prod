import { getSiteUrl } from "@/lib/seo/site-url";
import type { MetadataRoute } from "next";

const PUBLIC_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/privacy-policy", priority: 0.5, changeFrequency: "yearly" },
  { path: "/accessibility-statement", priority: 0.5, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  return PUBLIC_PATHS.map(({ path, priority, changeFrequency }) => ({
    url: base ? `${base}${path}` : path || "/",
    lastModified,
    changeFrequency,
    priority,
  }));
}
