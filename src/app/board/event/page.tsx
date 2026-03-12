import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getFeaturedPosts, getPostsByType, getSiteSettings } from "@/lib/repositories/content";
import { formatDate } from "@/lib/utils/date";

export const metadata: Metadata = {
  title: "이벤트",
  description: "인터넷공룡의 최신 이벤트와 프로모션 소식을 확인하세요."
};

export default async function EventListPage() {
  const [settings, featured, all] = await Promise.all([
    getSiteSettings(),
    getFeaturedPosts("event"),
    getPostsByType("event")
  ]);

  const featuredIds = new Set(featured.map((p) => p.id));
  const regular = all.filter((p) => !featuredIds.has(p.id));

  return (
    <SiteShell settings={settings}>
      <section className="section-space">
        <div className="container-page">
          <SectionHeading
            eyebrow="Event"
            title="이벤트 &amp; 프로모션"
            description="인터넷공룡의 최신 이벤트와 프로모션 소식을 확인하세요."
          />

          {featured.length > 0 && (
            <div className="mb-10 grid gap-6 sm:grid-cols-2">
              {featured.map((post) => (
                <article key={post.id} className="surface-card flex flex-col gap-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-orange">이벤트</p>
                  <h2 className="text-xl font-bold text-brand-graphite">{post.title}</h2>
                  <p className="flex-1 text-sm leading-6 text-brand-slate">{post.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-brand-slate">{formatDate(post.publishedAt)}</span>
                    <Button href={`/board/event/${post.slug}`} variant="secondary">
                      {post.ctaLabel ?? "자세히 보기"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {regular.length > 0 && (
            <div className="space-y-4">
              {regular.map((post) => (
                <article
                  key={post.id}
                  className="surface-card flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase text-brand-orange">이벤트</p>
                    <h2 className="mt-1 text-lg font-bold text-brand-graphite">{post.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-brand-slate">{post.summary}</p>
                  </div>
                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <span className="text-xs text-brand-slate">{formatDate(post.publishedAt)}</span>
                    <Link href={`/board/event/${post.slug}`} className="font-semibold text-brand-orange">
                      자세히 보기
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {featured.length === 0 && regular.length === 0 && (
            <p className="py-16 text-center text-brand-slate">진행 중인 이벤트가 없습니다.</p>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
