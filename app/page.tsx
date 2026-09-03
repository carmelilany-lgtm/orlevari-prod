import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Works } from "@/components/sections/Works";
import { AppProviders } from "@/components/providers/AppProviders";
import { JsonLd } from "@/components/seo/JsonLd";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { getSiteContentMap } from "@/lib/api/content";
import { loadSitePortfolioData } from "@/lib/data/site-data";
import { getRequestLocale } from "@/lib/i18n/request-locale";
import { buildHomeJsonLd } from "@/lib/seo/json-ld";
import { buildHomeMetadata } from "@/lib/seo/metadata";
import { resolveCrawlerOrigin } from "@/lib/seo/site-url";
import { pickHeroStillImagesRandom } from "@/lib/stills/hero-stills";

export async function generateMetadata() {
  return buildHomeMetadata();
}

export default async function HomePage() {
  const [siteData, cmsMap, initialLocale, origin] = await Promise.all([
    loadSitePortfolioData(),
    getSiteContentMap(),
    getRequestLocale(),
    resolveCrawlerOrigin(),
  ]);

  const whatsappEnvFallback = process.env.WHATSAPP_PHONE?.trim() || undefined;

  return (
    <AppProviders
      siteData={siteData}
      cmsMap={cmsMap}
      whatsappEnvFallback={whatsappEnvFallback}
      initialLocale={initialLocale}
    >
      <JsonLd
        data={buildHomeJsonLd({ origin, locale: initialLocale, cmsMap })}
      />
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
