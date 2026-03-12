import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { QuickInquiryForm } from "@/components/forms/QuickInquiryForm";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getPostByTypeAndSlug, getPostsByType, getProductBySlug, getSiteSettings } from "@/lib/repositories/content";
import { formatDate } from "@/lib/utils/date";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostByTypeAndSlug("guide", slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary }
  };
}

export async function generateStaticParams() {
  const posts = await getPostsByType("guide");
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [settings, post] = await Promise.all([getSiteSettings(), getPostByTypeAndSlug("guide", slug)]);

  if (!post) notFound();

  const relatedProducts = await Promise.all(
    post.relatedProductSlugs.map((s) => getProductBySlug(s))
  );
  const validRelated = relatedProducts.filter(Boolean);

  return (
    <SiteShell settings={settings}>
      <section className="section-space">
        <div className="container-page max-w-4xl">
          <article className="surface-card">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">가이드</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-brand-graphite">{post.title}</h1>
            <p className="mt-3 text-sm text-brand-slate">{formatDate(post.publishedAt)}</p>
            <div className="mt-8 rounded-2xl bg-brand-surface p-6 text-base leading-8 text-brand-slate">
              {post.body}
            </div>

            {validRelated.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-sm font-bold text-brand-graphite">관련 상품</p>
                <div className="flex flex-wrap gap-2">
                  {validRelated.map((product) => (
                    <Link
                      key={product!.id}
                      href={`/products/${product!.slug}`}
                      className="rounded-full border border-brand-orange px-4 py-1.5 text-sm font-semibold text-brand-orange hover:bg-orange-50 transition-colors"
                    >
                      {product!.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/apply">{post.ctaLabel ?? "지금 신청하기"}</Button>
              <Button href="/board/guide" variant="secondary">
                목록으로
              </Button>
            </div>
          </article>
        </div>
      </section>

      {/* Quick Inquiry Form */}
      <section className="section-space bg-gray-50">
        <div className="container-page max-w-xl">
          <SectionHeading eyebrow="Quick Inquiry" title="빠른 상담 문의" description="간단한 정보를 남겨주시면 전문 상담사가 빠르게 연락드립니다." />
          <QuickInquiryForm sourcePage={`/board/guide/${slug}`} submitLabel="빠른 견적 문의" />
        </div>
      </section>
    </SiteShell>
  );
}
