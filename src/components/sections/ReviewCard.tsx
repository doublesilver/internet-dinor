import Link from "next/link";
import type { Review } from "@/types/domain";
import { formatDate } from "@/lib/utils/date";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="surface-card">
      <div className="mb-3 flex flex-wrap gap-2">
        {review.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-brand-sky-soft px-3 py-1 text-xs font-semibold text-brand-graphite">
            {tag}
          </span>
        ))}
      </div>
      <h3 className="text-xl font-bold text-brand-graphite">{review.title}</h3>
      <p className="mt-3 text-sm leading-6 text-brand-slate">{review.summary}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-brand-slate">
        <span>{formatDate(review.publishedAt)}</span>
        <Link href={`/reviews/${review.slug}`} className="font-semibold text-brand-orange">
          자세히 보기
        </Link>
      </div>
    </article>
  );
}
