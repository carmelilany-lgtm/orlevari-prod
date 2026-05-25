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

export default async function HomePage() {
  const [siteData, cmsMap] = await Promise.all([
    loadSitePortfolioData(),
    getSiteContentMap(),
  ]);

  return (
    <AppProviders siteData={siteData} cmsMap={cmsMap}>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Works />
        <Services />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </AppProviders>
  );
}
