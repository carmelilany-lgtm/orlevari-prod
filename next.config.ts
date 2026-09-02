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

const projectSupabaseHost = supabaseHostname();

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
      ...(projectSupabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: projectSupabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
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
