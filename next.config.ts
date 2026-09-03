import type { NextConfig } from "next";

function supabaseHostname(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw?.trim()) return undefined;
  try {
    return new URL(raw).hostname;
  } catch {
    return undefined;
  }
}

function supabaseStoragePattern(hostname: string) {
  return {
    protocol: "https" as const,
    hostname,
    port: "",
    pathname: "/storage/v1/object/public/**",
    search: "",
  };
}

const projectSupabaseHost = supabaseHostname();
/** Production project ref — org id from billing emails is not this hostname. */
const PRODUCTION_SUPABASE_HOST = "usqloxzkisnloafhddcb.supabase.co";

const supabaseHosts = [
  ...new Set(
    [projectSupabaseHost, PRODUCTION_SUPABASE_HOST].filter(
      (host): host is string => Boolean(host),
    ),
  ),
];

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75, 85],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      ...supabaseHosts.map(supabaseStoragePattern),
      supabaseStoragePattern("**.supabase.co"),
      supabaseStoragePattern("**.supabase.in"),
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/**" },
      { protocol: "https", hostname: "img.youtube.com", pathname: "/**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "11mb",
    },
  },
};

export default nextConfig;
