import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { getPostByTypeAndSlug, getPostsByType, getSiteSettings } from "@/lib/repositories/content";
import { formatDate } from "@/lib/utils/date";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostByTypeAndSlug("event", slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary }
  };
}

export async function generateStaticParams() {
  const posts = await getPostsByType("event");
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [settings, post] = await Promise.all([getSiteSettings(), getPostByTypeAndSlug("event", slug)]);

  if (!post) notFound();

  return (
    <SiteShell settings={settings}>
      <section className="section-space">
        <div className="container-page max-w-4xl">
          <article className="surface-card">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">이벤트</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-brand-graphite">{post.title}</h1>
            <p className="mt-3 text-sm text-brand-slate">{formatDate(post.publishedAt)}</p>
            <div className="mt-8 rounded-2xl bg-brand-surface p-6 text-base leading-8 text-brand-slate">
              {post.body}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/apply">{post.ctaLabel ?? "지금 신청하기"}</Button>
              <Button href="/board/event" variant="secondary">
                목록으로
              </Button>
            </div>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
