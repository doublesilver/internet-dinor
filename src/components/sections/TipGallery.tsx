import Link from "next/link";
import type { Post } from "@/types/domain";

export function TipGallery({ tips }: { tips: Post[] }) {
  if (tips.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {tips.map((tip) => (
        <Link
          key={tip.id}
          href={`/board/guide/${tip.slug}`}
          className="group flex-shrink-0 w-56"
        >
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-brand-surface">
            {tip.thumbnailUrl ? (
              <img
                src={tip.thumbnailUrl}
                alt={tip.title}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl">💡</div>
            )}
          </div>
          <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-brand-graphite group-hover:text-brand-orange">
            {tip.title}
          </h3>
        </Link>
      ))}
    </div>
  );
}
