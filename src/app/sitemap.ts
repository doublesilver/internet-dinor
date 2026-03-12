import type { MetadataRoute } from "next";
import { getCarriers, getProducts, getPostsByType, getReviews } from "@/lib/repositories/content";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://internet-dinor.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, carriers, reviews, events, guides, notices] = await Promise.all([
    getProducts(),
    getCarriers(),
    getReviews(),
    getPostsByType("event"),
    getPostsByType("guide"),
    getPostsByType("notice")
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/compare`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/apply`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/reviews`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/board/event`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/board/guide`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/board/notice`, changeFrequency: "weekly", priority: 0.5 }
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

  const postPages = [...events, ...guides, ...notices].map((post) => ({
    url: `${BASE_URL}/board/${post.type}/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5
  }));

  return [...staticPages, ...productPages, ...carrierPages, ...reviewPages, ...postPages];
}
