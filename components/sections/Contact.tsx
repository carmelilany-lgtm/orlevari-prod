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
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,280px)] lg:gap-16">
          <ContactForm />
          {links.length > 0 ? (
            <aside className="space-y-6">
              <h3 className="text-base font-medium uppercase tracking-wider text-slate-500">
                {cms("contact_title", t.contact.title)}
              </h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.kind}>
                    <span className="block text-sm text-slate-500">
                      {link.label}
                    </span>
                    <a
                      href={link.href}
                      className="mt-1 block text-lg text-slate-200 transition-colors hover:text-cyan-400"
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
