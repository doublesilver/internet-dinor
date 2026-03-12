import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getBoardCategories, getBoardCategoryConfig, getBoardCategoryHref } from "@/lib/constants/board";
import { getPostByTypeAndSlug, getPostsByType, getProductBySlug } from "@/lib/repositories/content";
import { formatDate } from "@/lib/utils/date";

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const config = getBoardCategoryConfig(category);
  if (!config) return {};

  const post = await getPostByTypeAndSlug(config.type, slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary }
  };
}

export async function generateStaticParams() {
  const params: Array<{ category: string; slug: string }> = [];

  for (const category of getBoardCategories()) {
    const config = getBoardCategoryConfig(category);
    if (!config) continue;

    const posts = await getPostsByType(config.type);
    posts.forEach((post) => {
      params.push({ category, slug: post.slug });
    });
  }

  return params;
}

export default async function BoardDetailPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const config = getBoardCategoryConfig(category);
  if (!config) notFound();

  const post = await getPostByTypeAndSlug(config.type, slug);
  if (!post) notFound();

  const relatedProducts = config.showRelatedProducts
    ? await Promise.all(post.relatedProductSlugs.map((relatedSlug) => getProductBySlug(relatedSlug)))
    : [];
  const validRelatedProducts = relatedProducts.filter(Boolean);

  return (
    <section className="section-space">
      <div className="container-page max-w-4xl">
        <article className="surface-card">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">{config.badgeLabel}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-brand-graphite">{post.title}</h1>
          <p className="mt-3 text-sm text-brand-slate">{formatDate(post.publishedAt)}</p>
          <div className="mt-8 rounded-2xl bg-brand-surface p-6 text-base leading-8 text-brand-slate">{post.body}</div>

          {config.showRelatedProducts && validRelatedProducts.length > 0 ? (
            <div className="mt-8">
              <p className="mb-3 text-sm font-bold text-brand-graphite">관련 상품</p>
              <div className="flex flex-wrap gap-2">
                {validRelatedProducts.map((product) => (
                  <Link
                    key={product!.id}
                    href={`/products/${product!.slug}`}
                    className="rounded-full border border-brand-orange px-4 py-1.5 text-sm font-semibold text-brand-orange transition-colors hover:bg-orange-50"
                  >
                    {product!.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/apply">{post.ctaLabel ?? config.detailCtaLabel}</Button>
            <Button href={getBoardCategoryHref(category) ?? `/board/${category}`} variant="secondary">
              목록으로
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
}
