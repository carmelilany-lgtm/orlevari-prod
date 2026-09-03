import { unstable_cache } from "next/cache";
import { MOCK_SERVICES } from "@/data/mock";
import { SITE_CACHE_TAGS, SITE_DATA_REVALIDATE_SECONDS } from "@/lib/cache/site-tags";
import { warnSupabaseMissing, isSupabaseConfigured } from "@/lib/supabase/env";
import { toServiceDisplay } from "@/lib/supabase/mappers";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Service, ServiceDisplay } from "@/types/services";
import type { ServiceItem } from "@/types/works";

const SERVICE_PUBLIC_SELECT =
  "id, title_en, title_he, description_en, description_he, icon_key, sort_order";

const loadPublishedServices = unstable_cache(
  async (): Promise<ServiceDisplay[]> => {
    const supabase = createPublicSupabaseClient();
    if (!supabase) {
      console.error("[lev-ari] getPublishedServices: no Supabase client");
      return [];
    }

    const { data, error } = await supabase
      .from("services")
      .select(SERVICE_PUBLIC_SELECT)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[lev-ari] services:", error.message);
      return [];
    }

    if (!data?.length) {
      return [];
    }

    return (data as Service[]).map(toServiceDisplay);
  },
  ["published-services"],
  { revalidate: SITE_DATA_REVALIDATE_SECONDS, tags: [SITE_CACHE_TAGS.publicData] },
);

export async function getPublishedServices(): Promise<ServiceDisplay[]> {
  if (!isSupabaseConfigured()) {
    warnSupabaseMissing("getPublishedServices");
    return MOCK_SERVICES;
  }

  return loadPublishedServices();
}

/** Legacy ServiceItem shape for existing ServiceCard */
export async function getPublishedServiceItems(): Promise<ServiceItem[]> {
  const services = await getPublishedServices();
  return services.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    iconKey: s.iconKey,
  }));
}
