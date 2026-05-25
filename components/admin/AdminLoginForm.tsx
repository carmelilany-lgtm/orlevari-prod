"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
import {
  adminBtnPrimary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/admin-styles";
import { loginAdmin } from "@/lib/admin/actions/auth";
import { adminCopy } from "@/lib/admin/copy";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginAdmin(email, password, nextPath);

      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push(result.redirectTo);
      router.refresh();
    } catch {
      setError(adminCopy.auth.somethingWrong);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070b14] p-4">
      <form
        onSubmit={handleSubmit}
        className={`${adminCardClass} w-full max-w-md space-y-5 text-right`}
      >
        <div className="text-center">
          <p className="text-xs uppercase tracking-wider text-blue-400">
            {adminCopy.brand.loginBrand}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            {adminCopy.auth.loginTitle}
          </h1>
        </div>

        <AdminAlert variant="error" message={error} />

        <div>
          <label htmlFor="email" className={adminLabelClass}>
            {adminCopy.auth.email}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            dir="ltr"
            className={`${adminInputClass} text-left`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className={adminLabelClass}>
            {adminCopy.auth.password}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            dir="ltr"
            className={`${adminInputClass} text-left`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className={`${adminBtnPrimary} w-full`}
          disabled={loading}
        >
          {loading ? adminCopy.actions.signingIn : adminCopy.actions.signIn}
        </button>

        <p className="text-center">
          <Link
            href="/"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            {adminCopy.actions.viewSite}
          </Link>
        </p>
      </form>
    </div>
  );
}
