import { SupabaseConfigBanner } from "@/components/admin/SupabaseConfigBanner";
import { adminBtnPrimary } from "@/components/admin/admin-styles";
import { adminCopy } from "@/lib/admin/copy";
import { requireAdminPage } from "@/lib/admin/guard";
import { getSiteUrl } from "@/lib/seo/site-url";
import Link from "next/link";

export default async function AdminStillsCollagePage() {
  const session = await requireAdminPage();
  if (!session.configured) return <SupabaseConfigBanner />;

  const base = getSiteUrl()?.replace(/\/$/, "") ?? "";
  const publicEditorUrl = `${base || ""}/?editCollage=1#works`;

  return (
    <div className="mx-auto max-w-lg space-y-6 text-right">
      <h1 className="text-2xl font-semibold text-white">
        {adminCopy.collage.pageTitle}
      </h1>
      <p className="text-slate-300">{adminCopy.collage.intro}</p>
      <Link href={publicEditorUrl} className={adminBtnPrimary}>
        {adminCopy.collage.openPublicEditor}
      </Link>
      <p className="text-sm text-slate-500">
        <Link href="/admin/stills" className="text-blue-300 hover:underline">
          {adminCopy.collage.back}
        </Link>
      </p>
    </div>
  );
}
