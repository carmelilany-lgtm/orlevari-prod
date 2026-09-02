import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Fraunces, Noto_Sans_Hebrew, Outfit } from "next/font/google";
import { LOCALE_BOOTSTRAP_SCRIPT } from "@/lib/i18n/locale-storage";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
} from "@/lib/seo/metadata";
import { getMetadataBase } from "@/lib/seo/site-url";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSansHebrew = Noto_Sans_Hebrew({
  variable: "--font-hebrew",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const metadataBase = getMetadataBase();

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${notoSansHebrew.variable} ${fraunces.variable} min-h-full scroll-smooth bg-[#050a12]`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#070b14] text-slate-100 antialiased">
        <Script
          id="lev-ari-locale-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: LOCALE_BOOTSTRAP_SCRIPT }}
        />
        <>
          {children}
          {/* Vercel Analytics — active when deployed on Vercel */}
          <Analytics />
        </>
      </body>
    </html>
  );
}
