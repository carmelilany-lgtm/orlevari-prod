"use client";

import { ContactForm } from "@/components/ui/ContactForm";
import { EditableSectionHeading } from "@/components/visual-editor/EditableSectionHeading";
import { EditableText } from "@/components/visual-editor/EditableText";
import { usePublicContactLinks } from "@/lib/contact/use-public-contact";
import { useLanguage } from "@/lib/i18n/context";

function ContactMethodIcon({ kind }: { kind: "phone" | "email" }) {
  if (kind === "phone") {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
        />
      </svg>
    );
  }

  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
      />
    </svg>
  );
}

export function Contact() {
  const { t } = useLanguage();
  const links = usePublicContactLinks();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section-padding border-t border-blue-900/25"
    >
      <div className="container-narrow">
        <EditableSectionHeading
          id="contact-heading"
          titleKey="contact_title"
          titleFallback={t.contact.title}
          subtitleKey="contact_intro"
          subtitleFallback={t.contact.subtitle}
        />
        <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <ContactForm />
          </div>
          {links.length > 0 ? (
            <aside className="min-w-0 space-y-5 lg:pt-1">
              <h3 className="text-sm font-medium uppercase tracking-wider text-slate-500">
                <EditableText
                  as="span"
                  contentKey="contact_title"
                  fallback={t.contact.title}
                />
              </h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.kind} className="flex min-w-0 items-start gap-3">
                    <span
                      className="mt-1 shrink-0 text-cyan-300"
                      aria-hidden
                    >
                      <ContactMethodIcon kind={link.kind} />
                    </span>
                    <div className="min-w-0">
                      <span className="block text-sm font-medium tracking-wide text-slate-500">
                        {link.label}
                      </span>
                      <a
                        href={link.href}
                        className="mt-1 block break-words text-base font-medium leading-snug text-slate-200 transition-colors [overflow-wrap:anywhere] hover:text-cyan-400 sm:text-lg"
                        {...(link.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.value}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  );
}
