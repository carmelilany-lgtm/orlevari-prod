import "server-only";

import { isCurrentUserAdmin } from "@/lib/auth/is-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type OperationalCheckResult = {
  supabaseConfigured: boolean;
  canReadPublishedVideoCategories: boolean;
  videoCategoriesCount: number | null;
  videoCategoriesError: string | null;
  canReadSiteContent: boolean;
  siteContentCount: number | null;
  siteContentError: string | null;
  currentAdminEmail: string | null;
  isCurrentUserAdmin: boolean;
  canListStillsBucket: boolean;
  stillsBucketError: string | null;
};

/**
 * Live connectivity checks using the anon + session clients (no secrets returned).
 */
export async function runOperationalChecks(): Promise<OperationalCheckResult> {
  const base: OperationalCheckResult = {
    supabaseConfigured: isSupabaseConfigured(),
    canReadPublishedVideoCategories: false,
    videoCategoriesCount: null,
    videoCategoriesError: null,
    canReadSiteContent: false,
    siteContentCount: null,
    siteContentError: null,
    currentAdminEmail: null,
    isCurrentUserAdmin: false,
    canListStillsBucket: false,
    stillsBucketError: null,
  };

  if (!isSupabaseConfigured()) {
    return base;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return base;
  }

  const { data: categories, error: categoriesError } = await supabase
    .from("video_categories")
    .select("id", { count: "exact", head: false })
    .eq("is_published", true);

  if (categoriesError) {
    base.videoCategoriesError = categoriesError.message;
  } else {
    base.canReadPublishedVideoCategories = true;
    base.videoCategoriesCount = categories?.length ?? 0;
  }

  const { data: content, error: contentError } = await supabase
    .from("site_content")
    .select("id", { count: "exact", head: false });

  if (contentError) {
    base.siteContentError = contentError.message;
  } else {
    base.canReadSiteContent = true;
    base.siteContentCount = content?.length ?? 0;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email) {
    base.currentAdminEmail = user.email;
    base.isCurrentUserAdmin = await isCurrentUserAdmin();
  }

  if (base.isCurrentUserAdmin) {
    const { data: files, error: storageError } = await supabase.storage
      .from("stills")
      .list("", { limit: 1 });

    if (storageError) {
      base.stillsBucketError = storageError.message;
    } else {
      base.canListStillsBucket = true;
      void files;
    }
  } else if (user?.email) {
    base.stillsBucketError =
      "Admin storage check requires an account in admin_users (or ADMIN_ALLOWED_EMAILS).";
  } else {
    base.stillsBucketError = "Sign in to test stills bucket access.";
  }

  return base;
}
