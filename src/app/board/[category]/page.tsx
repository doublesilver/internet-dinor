import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { getBoardTypeFromCategory, getPostsByType, getSiteSettings } from "@/lib/repositories/content";
import { formatDate } from "@/lib/utils/date";

const categoryMeta: Record<string, { title: string; description: string }> = {
  notice: { title: "공지사항", description: "인터넷공룡의 공지사항과 업데이트 소식입니다." }
};

export function generateStaticParams() {
  return [{ category: "notice" }];
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMeta[category];
  if (!meta) return {};
  return { title: meta.title, description: meta.description, openGraph: { title: meta.title, description: meta.description } };
}

export default async function BoardCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (category !== "notice") notFound();

  const type = getBoardTypeFromCategory(category);
  if (!type) notFound();

  const [settings, posts] = await Promise.all([getSiteSettings(), getPostsByType(type)]);

  return (
    <SiteShell settings={settings}>
      <section className="section-space">
        <div className="container-page">
          <SectionHeading eyebrow="Board" title={`${type.toUpperCase()} 게시판`} description="인터넷공룡 공지사항과 운영 업데이트를 확인하세요." />
          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="surface-card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-brand-orange">{type.toUpperCase()}</p>
                  <h2 className="mt-2 text-xl font-bold text-brand-graphite">{post.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-brand-slate">{post.summary}</p>
                </div>
                <div className="flex flex-col items-start gap-2 md:items-end">
                  <span className="text-sm text-brand-slate">{formatDate(post.publishedAt)}</span>
                  <Link href={`/board/${category}/${post.slug}`} className="font-semibold text-brand-orange">
                    자세히 보기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
