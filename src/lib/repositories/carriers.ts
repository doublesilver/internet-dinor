import { carriersSeed } from "@/data/seeds";
import { mapCarrierRow } from "@/lib/repositories/mappers";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/server";
import type { Carrier } from "@/types/domain";

export async function getCarriers(): Promise<Carrier[]> {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("carriers").select("*").eq("status", "published").order("sort_order");

    if (!error && data) {
      return data.map(mapCarrierRow);
    }
  }

  return carriersSeed.filter((carrier) => carrier.status === "published").sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCarrierBySlug(slug: string) {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("carriers").select("*").eq("slug", slug).eq("status", "published").maybeSingle();

    if (!error && data) {
      return mapCarrierRow(data);
    }
  }

  return carriersSeed.find((carrier) => carrier.slug === slug && carrier.status === "published") ?? null;
}
