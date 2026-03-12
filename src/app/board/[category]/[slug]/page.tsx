import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { getBoardTypeFromCategory, getPostByTypeAndSlug, getPostsByType, getSiteSettings } from "@/lib/repositories/content";
import { formatDate } from "@/lib/utils/date";

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const type = getBoardTypeFromCategory(category);
  if (!type) return {};
  const post = await getPostByTypeAndSlug(type, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary }
  };
}

export async function generateStaticParams() {
  const categories = ["event", "guide", "notice"] as const;
  const params: Array<{ category: string; slug: string }> = [];

  for (const category of categories) {
    const type = getBoardTypeFromCategory(category);
    if (!type) continue;
    const posts = await getPostsByType(type);
    posts.forEach((post) => {
      params.push({ category, slug: post.slug });
    });
  }

  return params;
}

export default async function BoardDetailPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const type = getBoardTypeFromCategory(category);
  if (!type) notFound();

  const [settings, post] = await Promise.all([getSiteSettings(), getPostByTypeAndSlug(type, slug)]);
  if (!post) notFound();

  return (
    <SiteShell settings={settings}>
      <section className="section-space">
        <div className="container-page max-w-4xl">
          <article className="surface-card">
            <p className="text-sm font-semibold text-brand-orange">{type.toUpperCase()}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-brand-graphite">{post.title}</h1>
            <p className="mt-3 text-sm text-brand-slate">{formatDate(post.publishedAt)}</p>
            <div className="mt-8 rounded-2xl bg-brand-surface p-6 text-base leading-8 text-brand-slate">{post.body}</div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/apply">{post.ctaLabel ?? "문의하기"}</Button>
              <Button href={`/board/${category}`} variant="secondary">
                목록으로
              </Button>
            </div>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
