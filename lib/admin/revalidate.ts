import { revalidatePath } from "next/cache";

/** Revalidate public homepage after CMS / portfolio mutations. */
export function revalidatePublicSite() {
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
