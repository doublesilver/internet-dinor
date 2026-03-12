"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PromoBannerGrid } from "@/components/sections/PromoBannerGrid";
import { QuickInquiryForm } from "@/components/forms/QuickInquiryForm";
import { formatDate } from "@/lib/utils/date";

type Post = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  ctaLabel?: string;
};

type Props = {
  featuredEvents: Post[];
  regularEvents: Post[];
  notices: Post[];
};

const TABS = [
  { key: "event", label: "이벤트" },
  { key: "notice", label: "공지사항" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function EventBoardClient({ featuredEvents, regularEvents, notices }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("event");

  const featured = activeTab === "event" ? featuredEvents : [];
  const regular = activeTab === "event" ? regularEvents : notices;
  const basePath = activeTab === "event" ? "/board/event" : "/board/notice";

  return (
    <>
      {/* Top CTA buttons */}
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button href="tel:15884870" variant="primary">
          전화상담
        </Button>
        <Button href="/inquiry" variant="secondary">
          신청서 작성
        </Button>
        <Button href="/inquiry/quick" variant="secondary">
          빠른견적
        </Button>
      </div>

      {/* Tab UI */}
      <div className="mb-8 flex border-b border-brand-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={[
              "px-6 py-3 text-sm font-semibold transition-colors",
              activeTab === tab.key
                ? "border-b-2 border-brand-orange text-brand-orange"
                : "text-brand-slate hover:text-brand-graphite",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Featured cards */}
      {featured.length > 0 && (
        <div className="mb-10 grid gap-6 sm:grid-cols-2">
          {featured.map((post) => (
            <article key={post.id} className="surface-card flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-orange">이벤트</p>
              <h2 className="text-xl font-bold text-brand-graphite">{post.title}</h2>
              <p className="flex-1 text-sm leading-6 text-brand-slate">{post.summary}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-slate">{formatDate(post.publishedAt)}</span>
                <Button href={`${basePath}/${post.slug}`} variant="secondary">
                  {post.ctaLabel ?? "자세히 보기"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Regular list */}
      {regular.length > 0 && (
        <div className="mb-10 space-y-4">
          {regular.map((post) => (
            <article
              key={post.id}
              className="surface-card flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase text-brand-orange">
                  {activeTab === "event" ? "이벤트" : "공지사항"}
                </p>
                <h2 className="mt-1 text-lg font-bold text-brand-graphite">{post.title}</h2>
                <p className="mt-1 text-sm leading-6 text-brand-slate">{post.summary}</p>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <span className="text-xs text-brand-slate">{formatDate(post.publishedAt)}</span>
                <Link href={`${basePath}/${post.slug}`} className="font-semibold text-brand-orange">
                  자세히 보기
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {featured.length === 0 && regular.length === 0 && (
        <p className="py-16 text-center text-brand-slate">
          {activeTab === "event" ? "진행 중인 이벤트가 없습니다." : "공지사항이 없습니다."}
        </p>
      )}

      {/* Promo banner grid */}
      <div className="mb-16">
        <PromoBannerGrid />
      </div>

      {/* Quick inquiry form */}
      <div className="mx-auto max-w-lg">
        <h2 className="mb-6 text-center text-xl font-bold text-brand-graphite">빠른 견적 문의</h2>
        <QuickInquiryForm sourcePage="/board/event" submitLabel="빠른 견적 문의" />
      </div>
    </>
  );
}
