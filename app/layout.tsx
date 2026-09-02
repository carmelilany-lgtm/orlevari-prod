import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Noto_Sans_Hebrew } from "next/font/google";
import { LOCALE_BOOTSTRAP_SCRIPT } from "@/lib/i18n/locale-storage";
import { A11Y_BOOTSTRAP_SCRIPT } from "@/lib/a11y/prefs";
import {
  PRIVACY_BOOTSTRAP_SCRIPT,
  PRIVACY_CONSENT_KEY,
  PRIVACY_DECIDED_ATTR,
  parsePrivacyConsentText,
} from "@/lib/privacy/consent";
import { getRequestLocale } from "@/lib/i18n/request-locale";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_ICONS,
  SITE_SHARE_IMAGE,
  googleVerificationMetadata,
  localeOpenGraph,
} from "@/lib/seo/metadata";
import { getMetadataBase, resolvePublicOrigin } from "@/lib/seo/site-url";
import { cookies } from "next/headers";
import "./globals.css";

const notoSansHebrew = Noto_Sans_Hebrew({
  variable: "--font-sans",
  subsets: ["hebrew", "latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/** Fallback for non-home routes; homepage overrides via generateMetadata */
export async function generateMetadata(): Promise<Metadata> {
  const origin = await resolvePublicOrigin();
  const metadataBase = origin ? new URL(origin) : getMetadataBase();

  return {
    title: {
      default: DEFAULT_TITLE,
      template: "%s | לב ארי הפקות",
    },
    description: DEFAULT_DESCRIPTION,
    icons: SITE_ICONS,
    ...googleVerificationMetadata(),
    ...(metadataBase ? { metadataBase } : {}),
    openGraph: {
      siteName: "לב ארי הפקות",
      type: "website",
      ...localeOpenGraph("he"),
      images: [SITE_SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      images: [SITE_SHARE_IMAGE.url],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const dir = locale === "he" ? "rtl" : "ltr";
  const consentCookie = (await cookies()).get(PRIVACY_CONSENT_KEY)?.value;
  const privacyDecided =
    parsePrivacyConsentText(consentCookie)?.decided === true;

  return (
    <html
      lang={locale}
      dir={dir}
      data-scroll-behavior="smooth"
      {...(privacyDecided ? { [PRIVACY_DECIDED_ATTR]: "1" } : {})}
      className={`${notoSansHebrew.variable} min-h-full scroll-smooth bg-[#050a12]`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#070b14] text-slate-100 antialiased">
        <Script
          id="lev-ari-locale-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: LOCALE_BOOTSTRAP_SCRIPT }}
        />
        <Script
          id="lev-ari-a11y-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: A11Y_BOOTSTRAP_SCRIPT }}
        />
        <Script
          id="lev-ari-privacy-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: PRIVACY_BOOTSTRAP_SCRIPT }}
        />
        {children}
      </body>
    </html>
  );
}
