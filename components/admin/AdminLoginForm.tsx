"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { adminBtnPrimary, adminCardClass, adminInputClass, adminLabelClass } from "@/components/admin/admin-styles";
import { verifyAdminSession } from "@/lib/admin/actions/auth";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const verified = await verifyAdminSession();
    setLoading(false);

    if (!verified.success) {
      setError(verified.error);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070b14] p-4">
      <form
        onSubmit={handleSubmit}
        className={`${adminCardClass} w-full max-w-md space-y-5`}
      >
        <div className="text-center">
          <p className="text-xs uppercase tracking-wider text-blue-400">
            Lev Ari Productions
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Admin sign in</h1>
        </div>

        <AdminAlert variant="error" message={error} />

        <div>
          <label htmlFor="email" className={adminLabelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className={adminInputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className={adminLabelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            className={adminInputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className={`${adminBtnPrimary} w-full`} disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
