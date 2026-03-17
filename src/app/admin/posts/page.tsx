import type { Metadata } from "next";
import Link from "next/link";
import { StatusQuickToggle } from "@/components/admin/StatusQuickToggle";
import { getAllPostsAdmin, getAllReviewsAdmin } from "@/lib/repositories/content";

export const metadata: Metadata = { title: "게시글 관리 - 관리자" };

export default async function AdminPostsPage({
  searchParams
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const { type, status } = await searchParams;
  const [posts, reviews] = await Promise.all([getAllPostsAdmin(), getAllReviewsAdmin()]);

  const filteredPosts = posts.filter((post) => {
    if (type && type !== "all" && type !== "review") {
      if (post.type !== type) return false;
    }
    if (status === "published" || status === "draft") {
      if (post.status !== status) return false;
    }
    return true;
  });

  const filteredReviews = reviews.filter((review) => {
    if (status === "published" || status === "draft") {
      if (review.status !== status) return false;
    }
    return true;
  });

  const showPosts = !type || type === "all" || type === "event" || type === "guide" || type === "notice";
  const showReviews = !type || type === "all" || type === "review";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-orange">Posts</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">게시물 관리</h1>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/posts/new?entityType=post" className="inline-flex rounded-2xl bg-brand-orange px-5 py-3 text-sm font-semibold text-white">
          신규 게시물 등록
        </Link>
        <Link href="/admin/posts/new?entityType=review" className="inline-flex rounded-2xl border border-brand-orange bg-white px-5 py-3 text-sm font-semibold text-brand-orange">
          신규 후기 등록
        </Link>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-brand-slate">유형:</span>
          {[
            { value: "all", label: "전체" },
            { value: "event", label: "event" },
            { value: "guide", label: "guide" },
            { value: "notice", label: "notice" },
            { value: "review", label: "후기" }
          ].map((option) => (
            <Link
              key={option.value}
              href={`/admin/posts?${new URLSearchParams({ type: option.value, ...(status ? { status } : {}) }).toString()}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                (type ?? "all") === option.value ? "bg-brand-orange text-white" : "bg-brand-surface text-brand-graphite"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-brand-slate">상태:</span>
          {[
            { value: "", label: "전체" },
            { value: "published", label: "published" },
            { value: "draft", label: "draft" }
          ].map((option) => (
            <Link
              key={option.value}
              href={`/admin/posts?${new URLSearchParams({ ...(type ? { type } : {}), ...(option.value ? { status: option.value } : {}) }).toString()}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                (status ?? "") === option.value ? "bg-brand-orange text-white" : "bg-brand-surface text-brand-graphite"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {showPosts && filteredPosts.map((post) => (
          <article key={post.id} className="surface-card">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-brand-orange">{post.type}</p>
              <StatusQuickToggle endpoint={`/api/admin/posts/${post.id}/status`} initialStatus={post.status} entityLabel="게시물" entityType="post" />
            </div>
            <h2 className="mt-2 text-xl font-bold text-brand-graphite">{post.title}</h2>
            <div className="mt-4">
              <Link href={`/admin/posts/${post.id}`} className="font-semibold text-brand-orange">
                편집하기
              </Link>
            </div>
          </article>
        ))}
        {showReviews && filteredReviews.map((review) => (
          <article key={review.id} className="surface-card">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-brand-orange">review</p>
              <StatusQuickToggle endpoint={`/api/admin/posts/${review.id}/status`} initialStatus={review.status} entityLabel="후기" entityType="review" />
            </div>
            <h2 className="mt-2 text-xl font-bold text-brand-graphite">{review.title}</h2>
            <div className="mt-4">
              <Link href={`/admin/posts/${review.id}`} className="font-semibold text-brand-orange">
                편집하기
              </Link>
            </div>
          </article>
        ))}
        {showPosts && filteredPosts.length === 0 && showReviews && filteredReviews.length === 0 && (
          <p className="text-sm text-brand-slate col-span-2">조건에 맞는 게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
