"use client";

import { ContactForm } from "@/components/ui/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePublicContactLinks } from "@/lib/contact/use-public-contact";
import { useLanguage } from "@/lib/i18n/context";

export function Contact() {
  const { t, cms } = useLanguage();
  const links = usePublicContactLinks();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section-padding border-t border-blue-900/25"
    >
      <div className="container-narrow">
        <SectionHeading
          id="contact-heading"
          title={cms("contact_title", t.contact.title)}
          subtitle={cms("contact_intro", t.contact.subtitle)}
        />
        <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <ContactForm />
          </div>
          {links.length > 0 ? (
            <aside className="min-w-0 space-y-5 lg:pt-1">
              <h3 className="text-sm font-medium uppercase tracking-wider text-slate-500">
                {cms("contact_title", t.contact.title)}
              </h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.kind} className="min-w-0">
                    <span className="block text-sm text-slate-500">
                      {link.label}
                    </span>
                    <a
                      href={link.href}
                      className="mt-1 block break-words text-base leading-snug text-slate-200 transition-colors [overflow-wrap:anywhere] hover:text-cyan-400 sm:text-lg"
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.value}
                    </a>
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
