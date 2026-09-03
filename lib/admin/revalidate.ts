import { revalidatePath, revalidateTag } from "next/cache";
import { SITE_CACHE_TAGS } from "@/lib/cache/site-tags";

/** Revalidate public homepage after CMS / portfolio mutations. */
export function revalidatePublicSite() {
  revalidateTag(SITE_CACHE_TAGS.publicData, "max");
  revalidateTag(SITE_CACHE_TAGS.media, "max");
  revalidatePath("/");
}

/** Revalidate admin media pages after stills/content mutations. */
export function revalidateAdminMediaPages() {
  revalidatePath("/admin/stills");
  revalidatePath("/admin/content");
}

export function revalidateSiteAndAdminMedia() {
  revalidatePublicSite();
  revalidateAdminMediaPages();
}
