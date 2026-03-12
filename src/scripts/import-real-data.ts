import { readFile } from "node:fs/promises";
import path from "node:path";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "../lib/supabase/server";
import { loadProjectEnv } from "../lib/system/env";
import type { Carrier, Post, Product, Review, SiteSettings } from "../types/domain";

const SITE_SETTINGS_ID = "00000000-0000-0000-0000-000000000001";
const baseDir = path.join(process.cwd(), "src/data/fixtures/real-data");

async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(baseDir, filename);
  const raw = await readFile(filePath, "utf-8");
  const parsed: unknown = JSON.parse(raw);
  if (parsed === null || parsed === undefined) {
    throw new Error(`${filename}: parsed result is null or undefined`);
  }
  return parsed as T;
}

async function run() {
  loadProjectEnv();

  if (!hasSupabaseAdminEnv()) {
    throw new Error("Supabase environment variables are required to import real data.");
  }

  const supabase = createSupabaseAdminClient();
  const [carriers, products, posts, reviews, siteSettings] = await Promise.all([
    readJsonFile<Carrier[]>("carriers.json"),
    readJsonFile<Product[]>("products.json"),
    readJsonFile<Post[]>("posts.json"),
    readJsonFile<Review[]>("reviews.json"),
    readJsonFile<SiteSettings>("site-settings.json")
  ]);

  const { error: carriersError } = await supabase.from("carriers").upsert(
    carriers.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      short_name: item.shortName,
      summary: item.summary,
      hero_title: item.heroTitle,
      hero_description: item.heroDescription,
      feature_points: item.featurePoints,
      status: item.status,
      sort_order: item.sortOrder
    })),
    { onConflict: "slug" }
  );
  if (carriersError) throw new Error(`carriers upsert failed: ${carriersError.message}`);

  const { error: productsError } = await supabase.from("products").upsert(
    products.map((item) => ({
      id: item.id,
      carrier_id: item.carrierId,
      slug: item.slug,
      name: item.name,
      summary: item.summary,
      description: item.description,
      bundle_type: item.bundleType,
      internet_speed: item.internetSpeed,
      tv_included: item.tvIncluded,
      monthly_price_label: item.monthlyPriceLabel,
      benefit_label: item.benefitLabel,
      badge_tags: item.badgeTags,
      target_tags: item.targetTags,
      hero_points: item.heroPoints,
      detail_sections: item.detailSections,
      faq_items: item.faqItems,
      is_featured: item.isFeatured,
      status: item.status,
      sort_order: item.sortOrder
    })),
    { onConflict: "slug" }
  );
  if (productsError) throw new Error(`products upsert failed: ${productsError.message}`);

  const { error: postsError } = await supabase.from("posts").upsert(
    posts.map((item) => ({
      id: item.id,
      type: item.type,
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      body: item.body,
      thumbnail_url: item.thumbnailUrl ?? null,
      cta_label: item.ctaLabel ?? null,
      related_product_slugs: item.relatedProductSlugs,
      is_featured: item.isFeatured,
      published_at: item.publishedAt,
      status: item.status
    })),
    { onConflict: "slug" }
  );
  if (postsError) throw new Error(`posts upsert failed: ${postsError.message}`);

  const { error: reviewsError } = await supabase.from("reviews").upsert(
    reviews.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      body: item.body,
      review_type: item.reviewType,
      tags: item.tags,
      featured: item.featured,
      published_at: item.publishedAt,
      status: item.status
    })),
    { onConflict: "slug" }
  );
  if (reviewsError) throw new Error(`reviews upsert failed: ${reviewsError.message}`);

  const { error: siteSettingsError } = await supabase.from("site_settings").upsert(
    {
      id: SITE_SETTINGS_ID,
      site_name: siteSettings.siteName,
      phone_label: siteSettings.phoneLabel,
      phone_link: siteSettings.phoneLink,
      hero_cta_label: siteSettings.heroCtaLabel,
      secondary_cta_label: siteSettings.secondaryCtaLabel,
      footer_notice: siteSettings.footerNotice,
      business_info_json: siteSettings.businessInfo,
      policy_links_json: {
        privacy: "/policy/privacy",
        terms: "/policy/terms"
      }
    },
    { onConflict: "id" }
  );
  if (siteSettingsError) throw new Error(`site_settings upsert failed: ${siteSettingsError.message}`);

  console.log("Real data import completed");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
