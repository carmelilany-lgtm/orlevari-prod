"use client";

import { Button } from "@/components/ui/Button";
import { ServiceTypePicker } from "@/components/ui/ServiceTypePicker";
import { useSiteData } from "@/components/providers/SiteDataProvider";
import { buildServiceTypeOptions } from "@/lib/contact/service-types";
import {
  getContactValidationMessages,
} from "@/lib/contact/validation-messages";
import {
  mapApiErrorsToClient,
  validateContactFields,
  type ClientContactFieldKey,
} from "@/lib/contact/validation";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { LEAD_MESSAGE_MAX_LENGTH } from "@/types/leads";
import Link from "next/link";
import { type FormEvent, useId, useMemo, useState } from "react";

export interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  serviceType: string;
  message: string;
  privacyAccepted: boolean;
}

type FieldErrors = Partial<Record<ClientContactFieldKey, string>>;

const initialState: ContactFormData = {
  fullName: "",
  phone: "",
  email: "",
  serviceType: "",
  message: "",
  privacyAccepted: false,
};

interface ContactApiResponse {
  ok?: boolean;
  errors?: Record<string, string>;
}

async function submitContactForm(
  data: ContactFormData,
  language: "en" | "he",
  honeypot: string,
): Promise<ContactApiResponse> {
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

  try {
    return (await response.json()) as ContactApiResponse;
  } catch {
    return { ok: false };
  }
}

function FieldError({
  id,
  message,
  alignEnd,
}: {
  id: string;
  message?: string;
  alignEnd?: boolean;
}) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className={cn(
        "mt-1.5 text-sm text-red-300",
        alignEnd && "text-right",
      )}
    >
      {message}
    </p>
  );
}

function RequiredIndicator({ label }: { label: string }) {
  return (
    <>
      <span className="ms-1 text-red-400/90" aria-hidden="true">
        *
      </span>
      <span className="sr-only">{label}</span>
    </>
  );
}

export function ContactForm() {
  const { locale, t } = useLanguage();
  const { services } = useSiteData();
  const formId = useId();
  const serviceTypeOptions = useMemo(
    () => buildServiceTypeOptions(services, locale),
    [services, locale],
  );
  const validationMessages = useMemo(
    () => getContactValidationMessages(locale),
    [locale],
  );

  const [form, setForm] = useState<ContactFormData>(initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const errorIds = {
    fullName: `${formId}-fullName-error`,
    phone: `${formId}-phone-error`,
    email: `${formId}-email-error`,
    serviceType: `${formId}-serviceType-error`,
    message: `${formId}-message-error`,
    privacy: `${formId}-privacy-error`,
  };

  const inputClass =
    "w-full rounded-lg border border-blue-500/25 bg-blue-950/30 px-4 py-3.5 text-base text-slate-100 placeholder:text-slate-500 transition-colors focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30";

  const inputErrorClass =
    "border-red-500/50 focus:border-red-400/60 focus:ring-red-400/30";

  function clearFieldError(field: ClientContactFieldKey) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function runClientValidation(): FieldErrors {
    const errors = validateContactFields(
      {
        full_name: form.fullName,
        phone: form.phone,
        email: form.email,
        service_type: form.serviceType,
        message: form.message,
        privacy_accepted: form.privacyAccepted,
      },
      validationMessages,
    );
    return mapApiErrorsToClient(errors);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    const clientErrors = runClientValidation();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setStatus("idle");
      return;
    }

    setFieldErrors({});
    setStatus("submitting");

    const honeypot =
      (e.currentTarget.elements.namedItem("company_website") as HTMLInputElement)
        ?.value ?? "";

    const result = await submitContactForm(form, locale, honeypot);

    if (result.ok) {
      setStatus("success");
      setForm(initialState);
      setFieldErrors({});
      return;
    }

    if (result.errors && Object.keys(result.errors).length > 0) {
      setFieldErrors(mapApiErrorsToClient(result.errors));
      setStatus("idle");
      return;
    }

    setSubmitError(t.contact.form.error);
    setStatus("error");
  }

  const isHebrew = locale === "he";
  const labelAlign = isHebrew ? "text-right" : undefined;

  return (
    <div className="min-w-0">
      {status === "success" ? (
        <div
          role="status"
          aria-live="polite"
          className="mb-5 rounded-lg border border-cyan-500/35 bg-blue-950/50 px-4 py-3 text-base leading-snug text-slate-100"
        >
          {t.contact.form.success}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className={cn("space-y-5", status === "success" && "hidden")}
        dir={isHebrew ? "rtl" : "ltr"}
        noValidate
        aria-hidden={status === "success" ? true : undefined}
      >
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

        {submitError ? (
          <p
            role="alert"
            className="rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-200"
          >
            {submitError}
          </p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="min-w-0">
            <label
              htmlFor="fullName"
              className={cn("mb-2 block text-base font-medium text-slate-400", labelAlign)}
            >
              {t.contact.form.fullName}
              <RequiredIndicator label={t.contact.form.requiredMark} />
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              aria-required="true"
              aria-invalid={fieldErrors.fullName ? true : undefined}
              aria-describedby={
                fieldErrors.fullName ? errorIds.fullName : undefined
              }
              className={cn(
                inputClass,
                fieldErrors.fullName && inputErrorClass,
              )}
              value={form.fullName}
              onChange={(e) => {
                setForm((f) => ({ ...f, fullName: e.target.value }));
                clearFieldError("fullName");
              }}
            />
            <FieldError
              id={errorIds.fullName}
              message={fieldErrors.fullName}
              alignEnd={isHebrew}
            />
          </div>
          <div className="min-w-0">
            <label
              htmlFor="phone"
              className={cn("mb-2 block text-base font-medium text-slate-400", labelAlign)}
            >
              {t.contact.form.phone}
              <RequiredIndicator label={t.contact.form.requiredMark} />
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              dir="ltr"
              aria-required="true"
              aria-invalid={fieldErrors.phone ? true : undefined}
              aria-describedby={fieldErrors.phone ? errorIds.phone : undefined}
              className={cn(
                inputClass,
                fieldErrors.phone && inputErrorClass,
              )}
              value={form.phone}
              onChange={(e) => {
                setForm((f) => ({ ...f, phone: e.target.value }));
                clearFieldError("phone");
              }}
            />
            <FieldError
              id={errorIds.phone}
              message={fieldErrors.phone}
              alignEnd={isHebrew}
            />
          </div>
        </div>

        <div className="min-w-0">
          <label
            htmlFor="email"
            className={cn("mb-2 block text-base font-medium text-slate-400", labelAlign)}
          >
            {t.contact.form.email}
            <RequiredIndicator label={t.contact.form.requiredMark} />
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            aria-required="true"
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? errorIds.email : undefined}
            className={cn(inputClass, fieldErrors.email && inputErrorClass)}
            value={form.email}
            onChange={(e) => {
              setForm((f) => ({ ...f, email: e.target.value }));
              clearFieldError("email");
            }}
          />
          <FieldError
            id={errorIds.email}
            message={fieldErrors.email}
            alignEnd={isHebrew}
          />
        </div>

        <div className="min-w-0">
          <label
            htmlFor="serviceType"
            className={cn("mb-2 block text-base font-medium text-slate-400", labelAlign)}
          >
            {t.contact.form.serviceType}
            <RequiredIndicator label={t.contact.form.requiredMark} />
          </label>
          <ServiceTypePicker
            id="serviceType"
            label={t.contact.form.serviceType}
            placeholder={t.contact.form.selectService}
            options={serviceTypeOptions}
            value={form.serviceType}
            onChange={(serviceType) => {
              setForm((f) => ({ ...f, serviceType }));
              clearFieldError("serviceType");
            }}
            required
            inputClass={cn(
              inputClass,
              fieldErrors.serviceType && inputErrorClass,
            )}
            ariaInvalid={Boolean(fieldErrors.serviceType)}
            ariaDescribedBy={
              fieldErrors.serviceType ? errorIds.serviceType : undefined
            }
          />
          <FieldError
            id={errorIds.serviceType}
            message={fieldErrors.serviceType}
            alignEnd={isHebrew}
          />
        </div>

        <div className="min-w-0">
          <label
            htmlFor="message"
            className={cn("mb-2 block text-base font-medium text-slate-400", labelAlign)}
          >
            {t.contact.form.message}
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            maxLength={LEAD_MESSAGE_MAX_LENGTH}
            aria-invalid={fieldErrors.message ? true : undefined}
            aria-describedby={
              fieldErrors.message ? errorIds.message : undefined
            }
            className={cn(
              inputClass,
              "resize-y min-h-[100px]",
              fieldErrors.message && inputErrorClass,
            )}
            value={form.message}
            onChange={(e) => {
              setForm((f) => ({ ...f, message: e.target.value }));
              clearFieldError("message");
            }}
          />
          <FieldError
            id={errorIds.message}
            message={fieldErrors.message}
            alignEnd={isHebrew}
          />
        </div>

        <div className="min-w-0">
          <label className="flex w-full cursor-pointer items-start gap-3 text-base text-slate-400">
            <input
              type="checkbox"
              name="privacy"
              aria-required="true"
              aria-invalid={fieldErrors.privacyAccepted ? true : undefined}
              aria-describedby={
                fieldErrors.privacyAccepted ? errorIds.privacy : undefined
              }
              checked={form.privacyAccepted}
              onChange={(e) => {
                setForm((f) => ({
                  ...f,
                  privacyAccepted: e.target.checked,
                }));
                clearFieldError("privacyAccepted");
              }}
              className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-600 bg-zinc-900 text-blue-600 focus:ring-blue-500"
            />
            <span>
              {t.contact.form.privacyAgree}{" "}
              <Link
                href="/privacy-policy"
                className="text-cyan-300/90 underline underline-offset-2 transition-colors hover:text-cyan-200"
              >
                {t.contact.form.privacyLink}
              </Link>
              .
            </span>
          </label>
          <FieldError
            id={errorIds.privacy}
            message={fieldErrors.privacyAccepted}
            alignEnd={isHebrew}
          />
        </div>

        <div className="flex w-full justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={status === "submitting"}
            className="min-w-[11rem] px-8 py-3.5 font-semibold shadow-lg shadow-blue-900/50 hover:shadow-[0_0_28px_rgba(59,130,246,0.35)]"
          >
            {status === "submitting"
              ? t.contact.form.submitting
              : t.contact.form.submit}
          </Button>
        </div>
      </form>
    </div>
  );
}
