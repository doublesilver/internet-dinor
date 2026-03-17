import { carriersSeed } from "@/data/seeds";
import { throwIfSupabaseError } from "@/lib/repositories/errors";
import { mapCarrierRow } from "@/lib/repositories/mappers";
import { parseLineSeparatedText } from "@/lib/repositories/parsers";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/server";
import type { Carrier } from "@/types/domain";
import type { CarrierEditorValues } from "@/lib/validators/content";

export async function getCarriers(): Promise<Carrier[]> {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("carriers").select("*").eq("status", "published").order("sort_order");

    throwIfSupabaseError("carriers:getCarriers", error);

    if (data) {
      return data.map(mapCarrierRow);
    }

    return [];
  }

  return carriersSeed.filter((carrier) => carrier.status === "published").sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getAllCarriersAdmin(): Promise<Carrier[]> {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("carriers").select("*").order("sort_order");

    throwIfSupabaseError("carriers:getAllCarriersAdmin", error);

    if (data) {
      return data.map(mapCarrierRow);
    }

    return [];
  }

  return [...carriersSeed].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCarrierById(id: string): Promise<Carrier | null> {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("carriers").select("*").eq("id", id).maybeSingle();

    throwIfSupabaseError("carriers:getCarrierById", error);

    if (data) {
      return mapCarrierRow(data);
    }

    return null;
  }

  return carriersSeed.find((carrier) => carrier.id === id) ?? null;
}

export async function updateCarrier(id: string, input: CarrierEditorValues) {
  const payload = {
    name: input.name,
    short_name: input.shortName,
    slug: input.slug,
    summary: input.summary,
    hero_title: input.heroTitle,
    hero_description: input.heroDescription,
    feature_points: parseLineSeparatedText(input.featurePointsText),
    status: input.status,
    sort_order: input.sortOrder
  };

  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("carriers").update(payload).eq("id", id).select("*").maybeSingle();

    if (error) {
      return { success: false, statusCode: 500, message: "통신사 저장 중 오류가 발생했습니다." };
    }

    if (!data) {
      return { success: false, statusCode: 404, message: "통신사 정보를 찾을 수 없습니다." };
    }

    return { success: true, data: mapCarrierRow(data) };
  }

  const carrier = carriersSeed.find((item) => item.id === id);
  if (!carrier) {
    return { success: false, statusCode: 404, message: "통신사 정보를 찾을 수 없습니다." };
  }

  carrier.name = input.name;
  carrier.shortName = input.shortName;
  carrier.slug = input.slug;
  carrier.summary = input.summary;
  carrier.heroTitle = input.heroTitle;
  carrier.heroDescription = input.heroDescription;
  carrier.featurePoints = parseLineSeparatedText(input.featurePointsText);
  carrier.status = input.status;
  carrier.sortOrder = input.sortOrder;

  return { success: true, data: carrier };
}

export async function getCarrierBySlug(slug: string) {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("carriers").select("*").eq("slug", slug).eq("status", "published").maybeSingle();

    throwIfSupabaseError("carriers:getCarrierBySlug", error);

    if (data) {
      return mapCarrierRow(data);
    }

    return null;
  }

  return carriersSeed.find((carrier) => carrier.slug === slug && carrier.status === "published") ?? null;
}
