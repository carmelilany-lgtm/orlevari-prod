"use client";

import { Button } from "@/components/ui/Button";
import { useSiteData } from "@/components/providers/SiteDataProvider";
import { buildServiceTypeOptions } from "@/lib/contact/service-types";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { LEAD_MESSAGE_MAX_LENGTH } from "@/types/leads";
import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";

export interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  serviceType: string;
  message: string;
  privacyAccepted: boolean;
}

const initialState: ContactFormData = {
  fullName: "",
  phone: "",
  email: "",
  serviceType: "",
  message: "",
  privacyAccepted: false,
};

async function submitContactForm(
  data: ContactFormData,
  language: "en" | "he",
  honeypot: string,
): Promise<{ ok: boolean }> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      service_type: data.serviceType,
      message: data.message,
      language,
      privacy_accepted: data.privacyAccepted,
      company_website: honeypot,
    }),
  });

  if (!response.ok) {
    return { ok: false };
  }

  const json = (await response.json()) as { ok?: boolean };
  return { ok: Boolean(json.ok) };
}

export function ContactForm() {
  const { locale, t } = useLanguage();
  const { services, categories } = useSiteData();
  const serviceTypeOptions = useMemo(
    () => buildServiceTypeOptions(services, categories, locale),
    [services, categories, locale],
  );
  const [form, setForm] = useState<ContactFormData>(initialState);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const inputClass =
    "w-full rounded-lg border border-blue-500/25 bg-blue-950/30 px-4 py-3.5 text-base text-slate-100 placeholder:text-slate-500 transition-colors focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const honeypot =
      (e.currentTarget.elements.namedItem("company_website") as HTMLInputElement)
        ?.value ?? "";
    const result = await submitContactForm(form, locale, honeypot);
    if (result.ok) {
      setStatus("success");
      setForm(initialState);
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="rounded-xl border border-blue-500/30 bg-blue-950/30 px-6 py-8 text-center text-lg text-slate-200"
      >
        {t.contact.form.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot — hidden from users and assistive tech */}
      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-3 text-base text-red-200"
        >
          {t.contact.form.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="mb-2 block text-base text-slate-400">
            {t.contact.form.fullName}
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            className={inputClass}
            value={form.fullName}
            onChange={(e) =>
              setForm((f) => ({ ...f, fullName: e.target.value }))
            }
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-base text-slate-400">
            {t.contact.form.phone}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            className={inputClass}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-base text-slate-400">
          {t.contact.form.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </div>

      <div>
        <label htmlFor="serviceType" className="mb-2 block text-base text-slate-400">
          {t.contact.form.serviceType}
        </label>
        <select
          id="serviceType"
          name="serviceType"
          required
          className={cn(inputClass, "appearance-none")}
          value={form.serviceType}
          onChange={(e) =>
            setForm((f) => ({ ...f, serviceType: e.target.value }))
          }
        >
          <option value="">{t.contact.form.selectService}</option>
          {serviceTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-base text-slate-400">
          {t.contact.form.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={LEAD_MESSAGE_MAX_LENGTH}
          className={cn(inputClass, "resize-y min-h-[120px]")}
          value={form.message}
          onChange={(e) =>
            setForm((f) => ({ ...f, message: e.target.value }))
          }
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-base text-slate-400">
        <input
          type="checkbox"
          name="privacy"
          required
          checked={form.privacyAccepted}
          onChange={(e) =>
            setForm((f) => ({ ...f, privacyAccepted: e.target.checked }))
          }
          className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-blue-600 focus:ring-blue-500"
        />
        <span>
          {t.contact.form.privacyAgree}{" "}
          <Link
            href="/privacy-policy"
            className="text-cyan-300/90 underline underline-offset-2 transition-colors hover:text-cyan-200"
          >
            {t.contact.form.privacyLink}
          </Link>
        </span>
      </label>

      <Button
        type="submit"
        variant="primary"
        disabled={status === "submitting"}
        className="w-full sm:w-auto"
      >
        {status === "submitting"
          ? t.contact.form.submitting
          : t.contact.form.submit}
      </Button>
    </form>
  );
}
