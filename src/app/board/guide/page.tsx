import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getFeaturedPosts, getPostsByType, getSiteSettings } from "@/lib/repositories/content";
import { formatDate } from "@/lib/utils/date";

export const metadata: Metadata = {
  title: "가이드",
  description: "인터넷/TV 가입 전 알아두면 좋은 꿀팁 가이드 모음입니다."
};

export default async function GuideListPage() {
  const [settings, featured, all] = await Promise.all([
    getSiteSettings(),
    getFeaturedPosts("guide"),
    getPostsByType("guide")
  ]);

  const featuredIds = new Set(featured.map((p) => p.id));
  const regular = all.filter((p) => !featuredIds.has(p.id));

  return (
    <SiteShell settings={settings}>
      <section className="section-space">
        <div className="container-page">
          <SectionHeading
            eyebrow="Guide"
            title="꿀TIP 모아보기"
            description="인터넷/TV 가입 전 알아두면 좋은 꿀팁을 모아두었습니다."
          />

          {featured.length > 0 && (
            <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    <Button href={`/board/guide/${post.slug}`} variant="secondary">
                      {post.ctaLabel ?? "읽어보기"}
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
                    <p className="text-xs font-semibold uppercase text-brand-orange">가이드</p>
                    <h2 className="mt-1 text-lg font-bold text-brand-graphite">{post.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-brand-slate">{post.summary}</p>
                  </div>
                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <span className="text-xs text-brand-slate">{formatDate(post.publishedAt)}</span>
                    <Link href={`/board/guide/${post.slug}`} className="font-semibold text-brand-orange">
                      자세히 보기
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {featured.length === 0 && regular.length === 0 && (
            <p className="py-16 text-center text-brand-slate">등록된 가이드가 없습니다.</p>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
