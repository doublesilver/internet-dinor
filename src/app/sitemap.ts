import type { MetadataRoute } from "next";
import { getBoardCategories, getBoardCategoryConfig, getBoardCategoryHref, getBoardPostHref } from "@/lib/constants/board";
import { getCarriers, getProducts, getPostsByType, getReviews } from "@/lib/repositories/content";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://internet-dinor.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const boardConfigs = getBoardCategories()
    .map((category) => getBoardCategoryConfig(category))
    .filter((config): config is NonNullable<typeof config> => config !== null);
  const [products, carriers, reviews, postsByCategory] = await Promise.all([
    getProducts(),
    getCarriers(),
    getReviews(),
    Promise.all(boardConfigs.map((config) => getPostsByType(config.type)))
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/compare`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/apply`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/reviews`, changeFrequency: "weekly", priority: 0.7 },
    ...boardConfigs.flatMap((config) => {
      const href = getBoardCategoryHref(config.category);
      if (!href) return [];

      return [
        {
          url: `${BASE_URL}${href}`,
          changeFrequency: "weekly" as const,
          priority: config.sitemapPriority
        }
      ];
    })
  ];

  const productPages = products.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  const carrierPages = carriers.map((c) => ({
    url: `${BASE_URL}/carriers/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  const reviewPages = reviews.map((r) => ({
    url: `${BASE_URL}/reviews/${r.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5
  }));

  const postPages = postsByCategory.flatMap((posts) =>
    posts.flatMap((post) => {
      const href = getBoardPostHref(post.type, post.slug);
      if (!href) return [];

      return [
        {
          url: `${BASE_URL}${href}`,
          changeFrequency: "monthly" as const,
          priority: 0.5
        }
      ];
    })
  );

  return [...staticPages, ...productPages, ...carrierPages, ...reviewPages, ...postPages];
}
