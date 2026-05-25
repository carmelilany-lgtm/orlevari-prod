import { adminCardClass } from "@/components/admin/admin-styles";
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
          {ok ? "yes" : "no"}
        </span>
        {detail ? (
          <span className="ml-2 font-normal text-slate-500">{detail}</span>
        ) : null}
      </span>
    </div>
  );
}

export function IntegrationsPanel({ status }: Props) {
  const { operational: op } = status;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Integrations</h1>
        <p className="mt-1 text-sm text-slate-500">
          Environment readiness and safe connectivity checks. Secret values are
          never shown.
        </p>
      </div>

      <section className={`${adminCardClass} space-y-1`}>
        <h2 className="mb-2 text-lg font-semibold text-white">
          Environment variables
        </h2>
        <StatusRow
          label="Supabase URL configured"
          ok={status.supabaseUrlConfigured}
        />
        <StatusRow
          label="Supabase anon key configured"
          ok={status.supabaseAnonKeyConfigured}
        />
        <StatusRow
          label="Supabase service role configured"
          ok={status.supabaseServiceRoleConfigured}
        />
        <StatusRow
          label="ADMIN_ALLOWED_EMAILS configured"
          ok={status.adminAllowedEmailsConfigured}
        />
        <StatusRow
          label="Resend API key configured"
          ok={status.resendApiKeyConfigured}
        />
        <StatusRow label="EMAIL_FROM configured" ok={status.emailFromConfigured} />
        <StatusRow
          label="CONTACT_NOTIFICATION_EMAIL configured"
          ok={status.contactNotificationEmailConfigured}
        />
        <StatusRow
          label="NEXT_PUBLIC_SITE_URL configured"
          ok={status.siteUrlConfigured}
        />
      </section>

      <section className={`${adminCardClass} space-y-1`}>
        <h2 className="mb-2 text-lg font-semibold text-white">Client readiness</h2>
        <StatusRow
          label="Can use Supabase public client"
          ok={status.canUseSupabasePublicClient}
        />
        <StatusRow
          label="Can use Supabase admin client (service role)"
          ok={status.canUseSupabaseAdminClient}
        />
        <StatusRow label="Can use Resend (API key + EMAIL_FROM)" ok={status.canUseResend} />
      </section>

      <section className={`${adminCardClass} space-y-1`}>
        <h2 className="mb-2 text-lg font-semibold text-white">
          Operational checks
        </h2>
        <StatusRow
          label="Can read published video categories"
          ok={op.canReadPublishedVideoCategories}
          detail={
            op.videoCategoriesCount !== null
              ? `(${op.videoCategoriesCount} published)`
              : undefined
          }
        />
        <StatusRow
          label="Can read site_content"
          ok={op.canReadSiteContent}
          detail={
            op.siteContentCount !== null
              ? `(${op.siteContentCount} keys)`
              : undefined
          }
        />
        <StatusRow
          label="Current admin user"
          ok={Boolean(op.currentAdminEmail)}
          detail={op.currentAdminEmail ?? "not signed in"}
        />
        <StatusRow
          label="Current user is admin (DB or allow-list)"
          ok={op.isCurrentUserAdmin}
        />
        <StatusRow
          label="Stills bucket accessible (admin)"
          ok={op.canListStillsBucket}
          detail={op.stillsBucketMessage}
        />
      </section>

      <p className="text-xs text-slate-600">
        Test email delivery via the public contact form (English and Hebrew).
        See{" "}
        <code className="text-slate-500">docs/setup-live-integrations.md</code>{" "}
        for full setup steps. Terminal check:{" "}
        <code className="text-slate-500">npm run check:env</code>
      </p>
    </div>
  );
}
