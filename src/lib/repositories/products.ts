import { carriersSeed, productsSeed } from "@/data/seeds";
import { throwIfSupabaseError } from "@/lib/repositories/errors";
import { mapProductRow } from "@/lib/repositories/mappers";
import { parseCommaSeparatedText, parseLineSeparatedText, parsePairLines } from "@/lib/repositories/parsers";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/server";
import type { ContentStatus, Product } from "@/types/domain";
import type { ProductEditorValues } from "@/lib/validators/content";
import { getCarrierBySlug } from "@/lib/repositories/carriers";

export async function getProducts() {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("products").select("*").eq("status", "published").order("sort_order");

    throwIfSupabaseError("products:getProducts", error);

    if (data) {
      return data.map(mapProductRow);
    }

    return [];
  }

  return productsSeed.filter((product) => product.status === "published").sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getAllProductsAdmin() {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("products").select("*").order("sort_order");

    throwIfSupabaseError("products:getAllProductsAdmin", error);

    if (data) {
      return data.map(mapProductRow);
    }

    return [];
  }

  return [...productsSeed].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getFeaturedProducts() {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .eq("is_featured", true)
      .order("sort_order");

    throwIfSupabaseError("products:getFeaturedProducts", error);

    if (data) {
      return data.map(mapProductRow);
    }

    return [];
  }

  return productsSeed
    .filter((product) => product.status === "published" && product.isFeatured)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProductsByCarrierSlug(slug: string) {
  if (hasSupabaseAdminEnv()) {
    const carrier = await getCarrierBySlug(slug);
    if (!carrier) return [];

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .eq("carrier_id", carrier.id)
      .order("sort_order");

    throwIfSupabaseError("products:getProductsByCarrierSlug", error);

    if (data) {
      return data.map(mapProductRow);
    }

    return [];
  }

  const carrier = carriersSeed.find((item) => item.slug === slug);
  if (!carrier) return [];

  return productsSeed
    .filter((product) => product.status === "published" && product.carrierId === carrier.id)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).eq("status", "published").maybeSingle();

    throwIfSupabaseError("products:getProductBySlug", error);

    if (data) {
      return mapProductRow(data);
    }

    return null;
  }

  return productsSeed.find((product) => product.slug === slug && product.status === "published") ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

    throwIfSupabaseError("products:getProductById", error);

    if (data) {
      return mapProductRow(data);
    }

    return null;
  }

  return productsSeed.find((product) => product.id === id) ?? null;
}

export async function updateProduct(id: string, input: ProductEditorValues) {
  const payload = {
    name: input.name,
    slug: input.slug,
    summary: input.summary,
    description: input.description,
    carrier_id: input.carrierId,
    bundle_type: input.bundleType,
    internet_speed: input.internetSpeed,
    monthly_price_label: input.monthlyPriceLabel,
    original_price_label: input.originalPriceLabel || null,
    benefit_label: input.benefitLabel,
    badge_tags: parseCommaSeparatedText(input.badgeTagsText),
    target_tags: parseCommaSeparatedText(input.targetTagsText),
    hero_points: parseLineSeparatedText(input.heroPointsText),
    detail_sections: parsePairLines(input.detailSectionsText, "::").map((item) => ({ title: item.left, body: item.right })),
    faq_items: parsePairLines(input.faqItemsText, "::").map((item) => ({ q: item.left, a: item.right })),
    tv_included: input.tvIncluded,
    is_featured: input.isFeatured,
    status: input.status,
    sort_order: input.sortOrder
  };

  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("products").update(payload).eq("id", id).select("*").maybeSingle();

    if (error) {
      return { success: false, statusCode: 500, message: "상품 저장 중 오류가 발생했습니다." };
    }

    if (!data) {
      return { success: false, statusCode: 404, message: "상품 정보를 찾을 수 없습니다." };
    }

    return { success: true, data: mapProductRow(data) };
  }

  const product = productsSeed.find((item) => item.id === id);
  if (!product) {
    return { success: false, statusCode: 404, message: "상품 정보를 찾을 수 없습니다." };
  }

  product.name = input.name;
  product.slug = input.slug;
  product.summary = input.summary;
  product.description = input.description;
  product.carrierId = input.carrierId;
  product.bundleType = input.bundleType;
  product.internetSpeed = input.internetSpeed;
  product.monthlyPriceLabel = input.monthlyPriceLabel;
  product.originalPriceLabel = input.originalPriceLabel || undefined;
  product.benefitLabel = input.benefitLabel;
  product.badgeTags = parseCommaSeparatedText(input.badgeTagsText);
  product.targetTags = parseCommaSeparatedText(input.targetTagsText);
  product.heroPoints = parseLineSeparatedText(input.heroPointsText);
  product.detailSections = parsePairLines(input.detailSectionsText, "::").map((item) => ({ title: item.left, body: item.right }));
  product.faqItems = parsePairLines(input.faqItemsText, "::").map((item) => ({ q: item.left, a: item.right }));
  product.tvIncluded = input.tvIncluded;
  product.isFeatured = input.isFeatured;
  product.status = input.status;
  product.sortOrder = input.sortOrder;

  return { success: true, data: product };
}

export async function createProduct(input: ProductEditorValues) {
  const id = crypto.randomUUID();
  const payload = {
    id,
    name: input.name,
    slug: input.slug,
    summary: input.summary,
    description: input.description,
    carrier_id: input.carrierId,
    bundle_type: input.bundleType,
    internet_speed: input.internetSpeed,
    monthly_price_label: input.monthlyPriceLabel,
    original_price_label: input.originalPriceLabel || null,
    benefit_label: input.benefitLabel,
    badge_tags: parseCommaSeparatedText(input.badgeTagsText),
    target_tags: parseCommaSeparatedText(input.targetTagsText),
    hero_points: parseLineSeparatedText(input.heroPointsText),
    detail_sections: parsePairLines(input.detailSectionsText, "::").map((item) => ({ title: item.left, body: item.right })),
    faq_items: parsePairLines(input.faqItemsText, "::").map((item) => ({ q: item.left, a: item.right })),
    tv_included: input.tvIncluded,
    is_featured: input.isFeatured,
    status: input.status,
    sort_order: input.sortOrder
  };

  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("products").insert(payload).select("*").maybeSingle();

    if (error) {
      return { success: false, statusCode: 500, message: "상품 생성 중 오류가 발생했습니다." };
    }

    if (!data) {
      return { success: false, statusCode: 500, message: "상품 생성 결과를 확인할 수 없습니다." };
    }

    return { success: true, data: mapProductRow(data) };
  }

  const created: Product = {
    id,
    carrierId: input.carrierId,
    slug: input.slug,
    name: input.name,
    summary: input.summary,
    description: input.description,
    bundleType: input.bundleType,
    internetSpeed: input.internetSpeed,
    tvIncluded: input.tvIncluded,
    monthlyPriceLabel: input.monthlyPriceLabel,
    originalPriceLabel: input.originalPriceLabel || undefined,
    benefitLabel: input.benefitLabel,
    badgeTags: parseCommaSeparatedText(input.badgeTagsText),
    targetTags: parseCommaSeparatedText(input.targetTagsText),
    heroPoints: parseLineSeparatedText(input.heroPointsText),
    detailSections: parsePairLines(input.detailSectionsText, "::").map((item) => ({ title: item.left, body: item.right })),
    faqItems: parsePairLines(input.faqItemsText, "::").map((item) => ({ q: item.left, a: item.right })),
    isFeatured: input.isFeatured,
    status: input.status,
    sortOrder: input.sortOrder
  };

  productsSeed.push(created);

  return { success: true, data: created };
}

export async function deleteProduct(id: string) {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      return { success: false, statusCode: 500, message: "상품 삭제 중 오류가 발생했습니다." };
    }

    return { success: true };
  }

  const index = productsSeed.findIndex((item) => item.id === id);
  if (index === -1) {
    return { success: false, statusCode: 404, message: "상품 정보를 찾을 수 없습니다." };
  }

  productsSeed.splice(index, 1);
  return { success: true };
}

export async function updateProductStatus(id: string, status: ContentStatus) {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("products").update({ status }).eq("id", id).select("*").maybeSingle();

    if (error) {
      return { success: false, statusCode: 500, message: "상품 상태 변경 중 오류가 발생했습니다." };
    }

    if (!data) {
      return { success: false, statusCode: 404, message: "상품 정보를 찾을 수 없습니다." };
    }

    return { success: true, data: mapProductRow(data) };
  }

  const product = productsSeed.find((item) => item.id === id);
  if (!product) {
    return { success: false, statusCode: 404, message: "상품 정보를 찾을 수 없습니다." };
  }

  product.status = status;

  return { success: true, data: product };
}
