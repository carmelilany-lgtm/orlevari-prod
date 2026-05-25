import { revalidatePath } from "next/cache";

/** Revalidate public homepage after CMS / portfolio mutations. */
export function revalidatePublicSite() {
  revalidatePath("/");
}
