import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { getBoardCategoryConfig, getBoardCategories, getBoardPostHref } from "@/lib/constants/board";
import { getFeaturedPosts, getPostsByType } from "@/lib/repositories/content";
import { formatDate } from "@/lib/utils/date";

export function generateStaticParams() {
  return getBoardCategories().map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const config = getBoardCategoryConfig(category);
  if (!config) return {};

  return {
    title: config.metadataTitle,
    description: config.metadataDescription,
    openGraph: { title: config.metadataTitle, description: config.metadataDescription }
  };
}

export default async function BoardCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const config = getBoardCategoryConfig(category);
  if (!config) notFound();

  const [featured, posts] = await Promise.all([
    config.featuredVariant === "none" ? Promise.resolve([]) : getFeaturedPosts(config.type),
    getPostsByType(config.type)
  ]);

  const featuredIds = new Set(featured.map((post) => post.id));
  const regularPosts = posts.filter((post) => !featuredIds.has(post.id));

  return (
    <section className="section-space">
      <div className="container-page">
        <SectionHeading eyebrow={config.eyebrow} title={config.title} description={config.description} />

        {config.featuredVariant === "ranked" && featured.length > 0 ? (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((post, index) => (
              <article key={post.id} className="surface-card relative flex flex-col gap-4">
                <span className="absolute left-4 top-4 rounded-full bg-brand-orange px-2.5 py-0.5 text-xs font-bold text-white">
                  NO.{String(index + 1).padStart(3, "0")}
                </span>
                <div className="pt-6">
                  <h2 className="text-lg font-bold text-brand-graphite">{post.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-brand-slate">{post.summary}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-brand-slate">{formatDate(post.publishedAt)}</span>
                  <Link href={getBoardPostHref(category, post.slug) ?? `/board/${category}/${post.slug}`} className="font-semibold text-brand-orange">
                    {post.ctaLabel ?? "읽어보기"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {config.featuredVariant === "highlight" && featured.length > 0 ? (
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            {featured.map((post) => (
              <article key={post.id} className="surface-card flex flex-col gap-4">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-orange">{config.badgeLabel}</p>
                <h2 className="text-xl font-bold text-brand-graphite">{post.title}</h2>
                <p className="flex-1 text-sm leading-6 text-brand-slate">{post.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-brand-slate">{formatDate(post.publishedAt)}</span>
                  <Link href={getBoardPostHref(category, post.slug) ?? `/board/${category}/${post.slug}`} className="font-semibold text-brand-orange">
                    {post.ctaLabel ?? "자세히 보기"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {regularPosts.length > 0 ? (
          <div className="space-y-4">
            {regularPosts.map((post) => (
              <article key={post.id} className="surface-card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">{config.badgeLabel}</p>
                  <h2 className="mt-1 text-lg font-bold text-brand-graphite">{post.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-brand-slate">{post.summary}</p>
                </div>
                <div className="flex flex-col items-start gap-2 md:items-end">
                  <span className="text-xs text-brand-slate">{formatDate(post.publishedAt)}</span>
                  <Link href={getBoardPostHref(category, post.slug) ?? `/board/${category}/${post.slug}`} className="font-semibold text-brand-orange">
                    자세히 보기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {featured.length === 0 && regularPosts.length === 0 ? (
          <p className="py-16 text-center text-brand-slate">{config.emptyMessage}</p>
        ) : null}
      </div>
    </section>
  );
}
