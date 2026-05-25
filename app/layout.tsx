import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Heebo, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Lev Ari Productions | לב ארי הפקות",
    template: "%s | Lev Ari Productions",
  },
  description:
    "Cinematic video production for businesses, events & artists. הפקות וידאו קולנועיות לעסקים, אירועים ואמנים.",
  metadataBase: new URL("https://levari.productions"),
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
      className={`${inter.variable} ${heebo.variable} ${cormorant.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#070b14] text-slate-100 antialiased">
        <>
          {children}
          {/* Vercel Analytics — active when deployed on Vercel */}
          <Analytics />
        </>
      </body>
    </html>
  );
}
