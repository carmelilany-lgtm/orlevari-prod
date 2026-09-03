import { SITE_CACHE_TAGS, SITE_MEDIA_REVALIDATE_SECONDS } from "@/lib/cache/site-tags";
import { isPublicMediaBucketName } from "@/lib/images/public-media-url";
import { NextResponse } from "next/server";

export const revalidate = SITE_MEDIA_REVALIDATE_SECONDS;

type RouteContext = {
  params: Promise<{ bucket: string; path: string[] }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { bucket, path: pathParts } = await context.params;
  if (!isPublicMediaBucketName(bucket) || pathParts.length === 0) {
    return new NextResponse(null, { status: 404 });
  }

  const objectPath = pathParts.map((part) => decodeURIComponent(part)).join("/");
  if (
    objectPath.includes("..") ||
    objectPath.startsWith("/") ||
    objectPath.includes("//")
  ) {
    return new NextResponse(null, { status: 404 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!supabaseUrl) {
    return new NextResponse(null, { status: 404 });
  }

  const originUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
  const upstream = await fetch(originUrl, {
    cache: "force-cache",
    next: {
      revalidate: SITE_MEDIA_REVALIDATE_SECONDS,
      tags: [SITE_CACHE_TAGS.media],
    },
  });

  if (!upstream.ok || !upstream.body) {
    return new NextResponse(null, {
      status: upstream.status === 404 ? 404 : 502,
    });
  }

  const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": `public, max-age=${SITE_MEDIA_REVALIDATE_SECONDS}, s-maxage=${SITE_MEDIA_REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
    },
  });
}
