import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";
import { SupabaseConfigBanner } from "@/components/admin/SupabaseConfigBanner";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <>
      {!configured && (
        <div className="p-4">
          <SupabaseConfigBanner />
        </div>
      )}
      {params.error === "access_denied" && (
        <p
          className="mx-auto max-w-md px-4 pt-4 text-center text-sm text-red-300"
          role="alert"
        >
          Access denied. Your account is not authorized as an admin.
        </p>
      )}
      <AdminLoginForm />
    </>
  );
}
