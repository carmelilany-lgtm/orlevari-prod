import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Works } from "@/components/sections/Works";
import { AppProviders } from "@/components/providers/AppProviders";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { getSiteContentMap } from "@/lib/api/content";
import { loadSitePortfolioData } from "@/lib/data/site-data";
import { getRequestLocale } from "@/lib/i18n/request-locale";
import { buildHomeMetadata } from "@/lib/seo/metadata";
import { pickHeroStillImagesRandom } from "@/lib/stills/hero-stills";

export async function generateMetadata() {
  return buildHomeMetadata();
}

/** Fresh homepage data after admin revalidatePath('/') */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [siteData, cmsMap] = await Promise.all([
    loadSitePortfolioData(),
    getSiteContentMap(),
  ]);

  const whatsappEnvFallback = process.env.WHATSAPP_PHONE?.trim() || undefined;
  const initialLocale = await getRequestLocale();

  return (
    <AppProviders
      siteData={siteData}
      cmsMap={cmsMap}
      whatsappEnvFallback={whatsappEnvFallback}
      initialLocale={initialLocale}
    >
      <Header />
      <main id="main-content">
        <Hero
          heroCells={pickHeroStillImagesRandom(siteData.stills, 6)}
        />
        <About />
        <Services />
        <Works />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </AppProviders>
  );
}
