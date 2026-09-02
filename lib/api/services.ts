import { MOCK_SERVICES } from "@/data/mock";
import { warnSupabaseMissing, isSupabaseConfigured } from "@/lib/supabase/env";
import { toServiceDisplay } from "@/lib/supabase/mappers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Service, ServiceDisplay } from "@/types/services";
import type { ServiceItem } from "@/types/works";

export async function getPublishedServices(): Promise<ServiceDisplay[]> {
  if (!isSupabaseConfigured()) {
    warnSupabaseMissing("getPublishedServices");
    return MOCK_SERVICES;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    console.error("[lev-ari] getPublishedServices: no Supabase client");
    return [];
  }

  const { data, error } = await supabase
    .from("services")
    .select("*")
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
