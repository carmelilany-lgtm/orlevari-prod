import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Heebo, Inter } from "next/font/google";
import { LOCALE_BOOTSTRAP_SCRIPT } from "@/lib/i18n/locale-storage";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
} from "@/lib/seo/metadata";
import { getMetadataBase } from "@/lib/seo/site-url";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const heebo = Heebo({
  variable: "--font-hebrew",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${inter.variable} ${heebo.variable} ${cormorant.variable} h-full scroll-smooth bg-[#070b14]`}
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
