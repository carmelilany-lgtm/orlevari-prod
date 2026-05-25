import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminPage } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminPage();

  return (
    <AdminShell email={session.email || undefined}>
      {children}
    </AdminShell>
  );
}
