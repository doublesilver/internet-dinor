import Link from "next/link";

interface CarrierProductCardProps {
  carrierName: string;
  carrierSlug: string;
  productName: string;
  speed: string;
  channelCount?: string;
  originalPrice?: string;
  discountPrice: string;
  giftAmount?: string;
}

export function CarrierProductCard({
  carrierName,
  carrierSlug,
  productName,
  speed,
  channelCount,
  originalPrice,
  discountPrice,
  giftAmount
}: CarrierProductCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border-2 border-brand-border bg-white transition hover:border-brand-orange hover:shadow-soft">
      {/* Carrier header */}
      <div className="flex items-center justify-between border-b border-brand-border bg-brand-surface px-5 py-3">
        <span className="text-sm font-bold text-brand-graphite">{carrierName}</span>
        {giftAmount && (
          <span className="rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">
            {giftAmount}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-5 py-5">
        <h3 className="text-base font-bold leading-snug text-brand-graphite">{productName}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-sky-soft px-3 py-1 text-xs font-semibold text-brand-graphite">{speed}</span>
          {channelCount && (
            <span className="rounded-full bg-brand-sky-soft px-3 py-1 text-xs font-semibold text-brand-graphite">{channelCount}</span>
          )}
        </div>

        {/* Pricing */}
        <div className="mt-4 rounded-xl bg-brand-surface p-4">
          {originalPrice && (
            <p className="text-sm text-gray-400 line-through">월 {originalPrice}</p>
          )}
          <p className="text-2xl font-black text-brand-orange">
            월 {discountPrice}
          </p>
          <p className="mt-0.5 text-[11px] text-brand-slate">3년 약정 기준</p>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex border-t border-brand-border">
        <Link
          href="/apply"
          className="flex-1 border-r border-brand-border bg-brand-orange py-3.5 text-center text-sm font-bold text-white hover:bg-brand-orange-dark"
        >
          빠른 견적
        </Link>
        <Link
          href={`/carriers/${carrierSlug}`}
          className="flex-1 py-3.5 text-center text-sm font-bold text-brand-graphite hover:bg-brand-surface"
        >
          상품 보기
        </Link>
      </div>
    </article>
  );
}
