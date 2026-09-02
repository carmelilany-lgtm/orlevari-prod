import { adminCardClass } from "@/components/admin/admin-styles";
import { adminCopy } from "@/lib/admin/copy";
import type { IntegrationStatus } from "@/lib/env/diagnostics";

type Props = {
  status: IntegrationStatus;
};

function StatusRow({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-blue-950/50 py-3 last:border-0">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-sm font-medium">
        <span className={ok ? "text-emerald-400" : "text-amber-400"}>
          {ok ? adminCopy.integrations.present : adminCopy.integrations.missing}
        </span>
        {detail ? (
          <span className="me-2 font-normal text-slate-500" dir="ltr">
            {detail}
          </span>
        ) : null}
      </span>
    </div>
  );
}

export function IntegrationsPanel({ status }: Props) {
  const { operational: op } = status;
  const L = adminCopy.integrations.labels;

  return (
    <div className="space-y-6 text-right">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          {adminCopy.integrations.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {adminCopy.integrations.intro}
        </p>
      </div>

      <section className={`${adminCardClass} space-y-1`}>
        <h2 className="mb-2 text-lg font-semibold text-white">
          {adminCopy.integrations.envVars}
        </h2>
        <StatusRow label={L.supabaseUrl} ok={status.supabaseUrlConfigured} />
        <StatusRow
          label={L.supabaseAnon}
          ok={status.supabaseAnonKeyConfigured}
        />
        <StatusRow
          label={L.supabaseService}
          ok={status.supabaseServiceRoleConfigured}
        />
        <StatusRow
          label={L.adminEmails}
          ok={status.adminAllowedEmailsConfigured}
        />
        <StatusRow label={L.resend} ok={status.resendApiKeyConfigured} />
        <StatusRow label={L.emailFrom} ok={status.emailFromConfigured} />
        <StatusRow
          label={L.contactEmail}
          ok={status.contactNotificationEmailConfigured}
        />
        <StatusRow label={L.siteUrl} ok={status.siteUrlConfigured} />
        <StatusRow
          label={L.googleVerification}
          ok={status.googleSiteVerificationConfigured}
        />
      </section>

      <section className={`${adminCardClass} space-y-1`}>
        <h2 className="mb-2 text-lg font-semibold text-white">
          {adminCopy.integrations.clientReady}
        </h2>
        <StatusRow
          label={L.publicClient}
          ok={status.canUseSupabasePublicClient}
        />
        <StatusRow label={L.adminClient} ok={status.canUseSupabaseAdminClient} />
        <StatusRow label={L.resendReady} ok={status.canUseResend} />
      </section>

      <section className={`${adminCardClass} space-y-1`}>
        <h2 className="mb-2 text-lg font-semibold text-white">
          {adminCopy.integrations.operational}
        </h2>
        <StatusRow
          label={L.readCategories}
          ok={op.canReadPublishedVideoCategories}
          detail={
            op.videoCategoriesCount !== null
              ? adminCopy.integrations.labels.publishedCount(
                  op.videoCategoriesCount,
                )
              : undefined
          }
        />
        <StatusRow
          label={L.readContent}
          ok={op.canReadSiteContent}
          detail={
            op.siteContentCount !== null
              ? adminCopy.integrations.labels.keysCount(op.siteContentCount)
              : undefined
          }
        />
        <StatusRow
          label={L.currentAdmin}
          ok={Boolean(op.currentAdminEmail)}
          detail={op.currentAdminEmail ?? L.notSignedIn}
        />
        <StatusRow label={L.isAdmin} ok={op.isCurrentUserAdmin} />
        <StatusRow
          label={L.stillsBucket}
          ok={op.canListStillsBucket}
          detail={op.stillsBucketMessage}
        />
      </section>

      <p className="text-xs text-slate-600">
        {adminCopy.integrations.footer}{" "}
        <code className="text-slate-500" dir="ltr">
          docs/setup-live-integrations.md
        </code>{" "}
        · {adminCopy.integrations.footerCmd}
      </p>
    </div>
  );
}
