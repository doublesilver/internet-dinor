import type { Metadata } from "next";
import Link from "next/link";
import { StatusQuickToggle } from "@/components/admin/StatusQuickToggle";
import { getAllReviewsAdmin } from "@/lib/repositories/content";

export const metadata: Metadata = { title: "후기 관리 - 관리자" };

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const reviews = await getAllReviewsAdmin();

  const filtered = reviews.filter((review) => {
    if (status === "published" || status === "draft" || status === "pending") {
      if (review.status !== status) return false;
    }
    return true;
  });

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-orange">후기 관리</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">
          후기 관리
        </h1>
      </div>
      <div>
        <Link
          href="/admin/posts/new?entityType=review"
          className="inline-flex rounded-2xl bg-brand-orange px-5 py-3 text-sm font-semibold text-white"
        >
          신규 후기 등록
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-brand-slate">상태:</span>
        {[
          { value: "", label: "전체" },
          {
            value: "pending",
            label: `승인 대기${pendingCount > 0 ? ` (${pendingCount})` : ""}`,
          },
          { value: "published", label: "게시중" },
          { value: "draft", label: "임시저장" },
        ].map((option) => (
          <Link
            key={option.value}
            href={`/admin/reviews${option.value ? `?status=${option.value}` : ""}`}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              (status ?? "") === option.value
                ? "bg-brand-orange text-white"
                : "bg-brand-surface text-brand-graphite"
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((review) => (
          <article key={review.id} className="surface-card">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-brand-orange">
                  {review.reviewType}
                </p>
                {review.source === "customer" ? (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                    고객 작성
                    {review.authorName ? ` - ${review.authorName}` : ""}
                  </span>
                ) : null}
              </div>
              <StatusQuickToggle
                endpoint={`/api/admin/posts/${review.id}/status`}
                initialStatus={review.status}
                entityLabel="후기"
                entityType="review"
              />
            </div>
            <h2 className="mt-2 text-xl font-bold text-brand-graphite">
              {review.title}
            </h2>
            {review.summary && (
              <p className="mt-1 text-sm text-brand-slate line-clamp-2">
                {review.summary}
              </p>
            )}
            <div className="mt-4">
              <Link
                href={`/admin/posts/${review.id}`}
                className="font-semibold text-brand-orange"
              >
                편집하기
              </Link>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-brand-slate col-span-2">
            조건에 맞는 후기가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
