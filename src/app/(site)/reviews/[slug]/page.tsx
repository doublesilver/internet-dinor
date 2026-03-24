import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getReviewBySlug, getReviews } from "@/lib/repositories/content";
import { formatDate } from "@/lib/utils/date";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const review = await getReviewBySlug(slug);
  if (!review) return {};

  return {
    title: review.title,
    description: review.summary,
    openGraph: { title: review.title, description: review.summary },
  };
}

export async function generateStaticParams() {
  const reviews = await getReviews();
  return reviews.map((review) => ({ slug: review.slug }));
}

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const review = await getReviewBySlug(slug);

  if (!review) notFound();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://internetdinor.vercel.app";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: review.title,
    description: review.summary,
    url: `${siteUrl}/reviews/${review.slug}`,
    datePublished: review.publishedAt,
    author: {
      "@type": "Organization",
      name: "인터넷공룡",
    },
    publisher: {
      "@type": "Organization",
      name: "인터넷공룡",
      logo: { "@type": "ImageObject", url: `${siteUrl}/og-image.png` },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <section className="section-space">
        <div className="container-page max-w-4xl">
          <article className="surface-card">
            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand-sky-soft px-3 py-1 text-xs font-semibold text-brand-graphite"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-brand-graphite">
              {review.title}
            </h1>
            <div className="mt-3 flex items-center gap-3 text-sm text-brand-slate">
              <span>{formatDate(review.publishedAt)}</span>
              {review.source === "customer" && review.authorName ? (
                <span className="rounded-full bg-brand-sky-soft px-2.5 py-0.5 text-xs font-semibold text-brand-graphite">
                  {review.authorName} 님
                </span>
              ) : null}
            </div>
            <div className="mt-5 rounded-2xl bg-brand-surface p-4 text-base leading-8 text-brand-slate">
              {review.body}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/apply">비슷한 상담 문의하기</Button>
              <Button href="/reviews" variant="secondary">
                목록으로
              </Button>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
