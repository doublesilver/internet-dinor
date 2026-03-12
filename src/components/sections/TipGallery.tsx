import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/domain";

export function TipGallery({ tips }: { tips: Post[] }) {
  if (tips.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {tips.map((tip, index) => (
        <Link
          key={tip.id}
          href={`/board/guide/${tip.slug}`}
          className="group flex-shrink-0 w-56"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-surface">
            {tip.thumbnailUrl ? (
              <Image
                src={tip.thumbnailUrl}
                alt={tip.title}
                fill
                className="object-cover transition group-hover:scale-105"
                sizes="224px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl">💡</div>
            )}
            <span className="absolute left-2 top-2 rounded-full bg-brand-orange px-2 py-0.5 text-xs font-bold text-white">
              NO.{String(index + 1).padStart(3, "0")}
            </span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-brand-graphite group-hover:text-brand-orange">
            {tip.title}
          </h3>
        </Link>
      ))}
    </div>
  );
}
