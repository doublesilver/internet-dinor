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
    <article className="surface-card flex flex-col">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-lg bg-brand-surface px-3 py-1 text-xs font-bold text-brand-graphite">
          {carrierName}
        </span>
        {giftAmount && (
          <span className="rounded-lg bg-brand-orange/10 px-3 py-1 text-xs font-bold text-brand-orange">
            사은품 {giftAmount}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-brand-graphite">{productName}</h3>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-brand-slate">
        <span className="rounded-full bg-brand-sky-soft px-3 py-1">{speed}</span>
        {channelCount && (
          <span className="rounded-full bg-brand-sky-soft px-3 py-1">{channelCount}ch</span>
        )}
      </div>
      <div className="mt-4 border-t border-brand-border pt-4">
        {originalPrice && (
          <p className="price-original">월 {originalPrice}</p>
        )}
        <p className="price-discount">월 {discountPrice}</p>
        <p className="mt-1 text-xs text-brand-slate">3년 약정 기준</p>
      </div>
      <div className="mt-auto flex gap-2 pt-4">
        <Link
          href="/apply"
          className="flex-1 rounded-xl bg-brand-orange px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-orange-dark"
        >
          빠른 견적
        </Link>
        <Link
          href={`/carriers/${carrierSlug}`}
          className="flex-1 rounded-xl border border-brand-border px-4 py-2.5 text-center text-sm font-semibold text-brand-graphite hover:bg-brand-surface"
        >
          상품 보기
        </Link>
      </div>
    </article>
  );
}
