import "server-only";

import { getAllowedAdminEmails } from "@/lib/auth/is-admin";
import {
  isNotificationEmailConfigured,
  isResendConfigured,
} from "@/lib/resend/env";
import {
  isSupabaseConfigured,
  isSupabaseServiceRoleConfigured,
} from "@/lib/supabase/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type IntegrationConfigStatus = {
  supabaseUrlConfigured: boolean;
  supabaseAnonKeyConfigured: boolean;
  supabaseServiceRoleConfigured: boolean;
  adminAllowedEmailsConfigured: boolean;
  resendApiKeyConfigured: boolean;
  emailFromConfigured: boolean;
  contactNotificationEmailConfigured: boolean;
  siteUrlConfigured: boolean;
  canUseSupabasePublicClient: boolean;
  canUseSupabaseAdminClient: boolean;
  canUseResend: boolean;
};

export type IntegrationOperationalStatus = {
  canReadPublishedVideoCategories: boolean;
  canReadSiteContent: boolean;
  currentAdminEmail: string | null;
  isCurrentUserAdmin: boolean;
  canListStillsBucket: boolean;
  stillsBucketMessage: string;
  videoCategoriesCount: number | null;
  siteContentCount: number | null;
};

export type IntegrationStatus = IntegrationConfigStatus & {
  operational: IntegrationOperationalStatus;
};

function envPresent(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

/** Safe env presence checks - never returns secret values. */
export function getIntegrationConfigStatus(): IntegrationConfigStatus {
  const supabaseUrlConfigured = envPresent(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKeyConfigured = envPresent(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const supabaseServiceRoleConfigured = envPresent(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const adminAllowedEmailsConfigured = getAllowedAdminEmails().length > 0;
  const resendApiKeyConfigured = envPresent(process.env.RESEND_API_KEY);
  const emailFromConfigured = envPresent(process.env.EMAIL_FROM);
  const contactNotificationEmailConfigured = envPresent(
    process.env.CONTACT_NOTIFICATION_EMAIL,
  );
  const siteUrlConfigured = envPresent(process.env.NEXT_PUBLIC_SITE_URL);

  const canUseSupabasePublicClient =
    supabaseUrlConfigured && supabaseAnonKeyConfigured;
  const canUseSupabaseAdminClient = isSupabaseServiceRoleConfigured();
  const canUseResend =
    resendApiKeyConfigured &&
    emailFromConfigured &&
    isResendConfigured();

  return {
    supabaseUrlConfigured,
    supabaseAnonKeyConfigured,
    supabaseServiceRoleConfigured,
    adminAllowedEmailsConfigured,
    resendApiKeyConfigured,
    emailFromConfigured,
    contactNotificationEmailConfigured,
    siteUrlConfigured,
    canUseSupabasePublicClient,
    canUseSupabaseAdminClient,
    canUseResend,
  };
}

/**
 * Live connectivity checks (anon / session). Never exposes secrets.
 * Call only from protected server contexts (admin pages, scripts).
 */
export async function getIntegrationOperationalStatus(): Promise<IntegrationOperationalStatus> {
  const defaults: IntegrationOperationalStatus = {
    canReadPublishedVideoCategories: false,
    canReadSiteContent: false,
    currentAdminEmail: null,
    isCurrentUserAdmin: false,
    canListStillsBucket: false,
    stillsBucketMessage: "Supabase not configured",
    videoCategoriesCount: null,
    siteContentCount: null,
  };

  if (!isSupabaseConfigured()) {
    return defaults;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return defaults;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user?.email) {
    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", user.email.trim().toLowerCase())
      .maybeSingle();
    isAdmin = Boolean(adminRow);
    if (!isAdmin) {
      const allowed = getAllowedAdminEmails();
      isAdmin = allowed.includes(user.email.trim().toLowerCase());
    }
  }

  const { count: categoryCount, error: catError } = await supabase
    .from("video_categories")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  const { count: contentCount, error: contentError } = await supabase
    .from("site_content")
    .select("*", { count: "exact", head: true });

  let canListStillsBucket = false;
  let stillsBucketMessage = "Not checked";

  if (isAdmin) {
    const { data: bucketList, error: bucketError } = await supabase.storage
      .from("stills")
      .list("", { limit: 1 });

    if (bucketError) {
      stillsBucketMessage = bucketError.message;
    } else {
      canListStillsBucket = true;
      stillsBucketMessage =
        bucketList && bucketList.length >= 0
          ? "Bucket accessible (admin)"
          : "Bucket accessible (admin)";
    }
  } else if (!user) {
    stillsBucketMessage = "Sign in as admin to test storage";
  } else {
    stillsBucketMessage = "Admin storage check requires admin_users row";
  }

  return {
    canReadPublishedVideoCategories: !catError,
    canReadSiteContent: !contentError,
    currentAdminEmail: user?.email ?? null,
    isCurrentUserAdmin: isAdmin,
    canListStillsBucket,
    stillsBucketMessage,
    videoCategoriesCount: catError ? null : (categoryCount ?? 0),
    siteContentCount: contentError ? null : (contentCount ?? 0),
  };
}

/** Full integration readiness for admin diagnostics page. */
export async function getIntegrationStatus(): Promise<IntegrationStatus> {
  const config = getIntegrationConfigStatus();
  const operational = await getIntegrationOperationalStatus();
  return { ...config, operational };
}

/** Whether bootstrap via service role is possible (no secrets returned). */
export function canBootstrapAdminUsers(): boolean {
  return isSupabaseServiceRoleConfigured() && createAdminSupabaseClient() !== null;
}

/** Resend ready for sending (notification inbox optional per email type). */
export function getResendReadiness(): {
  configured: boolean;
  notificationConfigured: boolean;
} {
  return {
    configured: isResendConfigured(),
    notificationConfigured: isNotificationEmailConfigured(),
  };
}
