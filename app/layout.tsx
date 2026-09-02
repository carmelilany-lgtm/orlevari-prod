import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Noto_Sans_Hebrew } from "next/font/google";
import { LOCALE_BOOTSTRAP_SCRIPT } from "@/lib/i18n/locale-storage";
import { A11Y_BOOTSTRAP_SCRIPT } from "@/lib/a11y/prefs";
import { getRequestLocale } from "@/lib/i18n/request-locale";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
} from "@/lib/seo/metadata";
import { getMetadataBase } from "@/lib/seo/site-url";
import "./globals.css";

const notoSansHebrew = Noto_Sans_Hebrew({
  variable: "--font-sans",
  subsets: ["hebrew", "latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const metadataBase = getMetadataBase();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/** Fallback for non-home routes; homepage overrides via generateMetadata */
export const metadata: Metadata = {
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Lev Ari Productions",
  },
  description: DEFAULT_DESCRIPTION,
  ...(metadataBase ? { metadataBase } : {}),
  openGraph: {
    siteName: "Lev Ari Productions",
    type: "website",
    locale: "en_US",
    alternateLocale: ["he_IL"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const dir = locale === "he" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      data-scroll-behavior="smooth"
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
        {children}
      </body>
    </html>
  );
}
