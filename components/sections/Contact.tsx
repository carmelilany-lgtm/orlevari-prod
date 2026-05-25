"use client";

import { ContactForm } from "@/components/ui/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n/context";

const WHATSAPP_URL = "https://wa.me/972500000000";

export function Contact() {
  const { t, cms } = useLanguage();

  const phone = cms("phone", t.contact.placeholders.phone);
  const email = cms("email", t.contact.placeholders.email);

  const links = [
    {
      label: t.contact.links.phone,
      href: `tel:${phone.replace(/\s/g, "")}`,
      value: phone,
    },
    {
      label: t.contact.links.email,
      href: `mailto:${email}`,
      value: email,
    },
    {
      label: t.contact.links.whatsapp,
      href: WHATSAPP_URL,
      value: t.contact.links.whatsapp,
    },
  ];

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
          <aside className="space-y-6">
            <h3 className="text-base font-medium uppercase tracking-wider text-slate-500">
              {cms("contact_title", t.contact.title)}
            </h3>
            <ul className="space-y-4">
              {links.map((link) => (
                <li key={link.label}>
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
        </div>
      </div>
    </section>
  );
}
