import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { ReviewCard } from "@/components/sections/ReviewCard";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { PromoBannerGrid } from "@/components/sections/PromoBannerGrid";
import { QuickInquiryForm } from "@/components/forms/QuickInquiryForm";
import { getFeaturedReviews, getReviews, getSiteSettings } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "고객 후기",
  description: "인터넷공룡을 통해 가입한 고객들의 실제 후기입니다."
};

export default async function ReviewsPage() {
  const [settings, featured, all] = await Promise.all([
    getSiteSettings(),
    getFeaturedReviews(),
    getReviews()
  ]);

  const featuredIds = new Set(featured.map((r) => r.id));
  const regular = all.filter((r) => !featuredIds.has(r.id));

  return (
    <SiteShell settings={settings}>
      {/* Promo Banner Grid */}
      <div className="container-page py-6">
        <PromoBannerGrid />
      </div>

      <section className="section-space">
        <div className="container-page">
          <SectionHeading
            eyebrow="Review"
            title="고객 후기"
            description="인터넷공룡을 통해 가입한 고객들의 실제 후기입니다."
          />

          {/* 베스트 후기 section with NO.001~005 numbering badges */}
          {featured.length > 0 && (
            <div className="mb-12">
              <p className="mb-4 text-sm font-bold tracking-wider text-brand-orange">베스트 후기!</p>
              <div className="grid gap-6 lg:grid-cols-2">
                {featured.map((review, index) => (
                  <div key={review.id} className="relative ring-2 ring-brand-orange ring-offset-2 rounded-2xl">
                    <span className="absolute -top-3 -left-3 z-10 flex h-8 w-16 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white shadow">
                      NO.{String(index + 1).padStart(3, "0")}
                    </span>
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 전체 후기 section with 후기쓰기 button */}
          {regular.length > 0 && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                {featured.length > 0 && (
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-slate">전체 후기</p>
                )}
                <Link
                  href="/reviews/write"
                  className="ml-auto rounded-xl bg-brand-orange px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                  후기쓰기
                </Link>
              </div>
              <div className="grid gap-5 lg:grid-cols-2">
                {regular.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border text-sm text-brand-slate transition-colors hover:bg-gray-100"
                  aria-label="이전 페이지"
                >
                  &lsaquo;
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                      page === 1
                        ? "border-brand-orange bg-brand-orange text-white"
                        : "border-brand-border text-brand-slate hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border text-sm text-brand-slate transition-colors hover:bg-gray-100"
                  aria-label="다음 페이지"
                >
                  &rsaquo;
                </button>
              </div>
            </div>
          )}

          {featured.length === 0 && regular.length === 0 && (
            <p className="py-16 text-center text-brand-slate">등록된 후기가 없습니다.</p>
          )}
        </div>
      </section>

      {/* Quick Inquiry Form */}
      <section className="section-space bg-gray-50">
        <div className="container-page max-w-xl">
          <SectionHeading
            eyebrow="Quick Inquiry"
            title="빠른 상담 문의"
            description="간단한 정보를 남겨주시면 전문 상담사가 빠르게 연락드립니다."
          />
          <QuickInquiryForm sourcePage="/reviews" submitLabel="빠른 견적 문의" />
        </div>
      </section>
    </SiteShell>
  );
}
