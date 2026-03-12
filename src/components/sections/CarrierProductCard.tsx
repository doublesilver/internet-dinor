import Image from "next/image";
import Link from "next/link";

interface CarrierProductCardProps {
  carrierName: string;
  carrierSlug: string;
  carrierLogo: string;
  productName: string;
  speed: string;
  channelCount?: string;
  originalPrice?: string;
  discountPrice: string;
  giftAmount?: string;
  accentColor?: string;
}

export function CarrierProductCard({
  carrierName,
  carrierSlug,
  carrierLogo,
  productName,
  speed,
  channelCount,
  originalPrice,
  discountPrice,
  giftAmount,
  accentColor = "#f15c2d"
}: CarrierProductCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[30px] bg-white shadow-[4px_4px_2px_rgba(0,0,0,0.1)]">
      {/* Carrier logo */}
      <div className="flex items-center justify-center border-b border-brand-border px-6 py-4">
        <Image src={carrierLogo} alt={carrierName} width={120} height={40} className="h-8 w-auto object-contain" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 py-5 text-center">
        <h3 className="text-base font-bold leading-snug text-gray-900">{productName}</h3>

        <div className="mt-3 space-y-1 text-sm text-gray-500">
          <p>+ 와이파이</p>
          {channelCount && <p>+ {channelCount}</p>}
          {giftAmount && <p>+ {giftAmount}</p>}
          <p>+ 비밀지원금</p>
        </div>

        {/* Pricing */}
        <div className="mt-4 py-3">
          {originalPrice && (
            <span className="mr-3 text-lg text-gray-300 line-through">{originalPrice}</span>
          )}
          <span style={{ color: accentColor }} className="text-lg">
            월 <strong className="text-2xl">{discountPrice}</strong>
          </span>
        </div>
      </div>

      {/* CTA buttons - per carrier color */}
      <div className="flex">
        <Link
          href={`/carriers/${carrierSlug}`}
          style={{ backgroundColor: accentColor }}
          className="flex-1 py-3.5 text-center text-sm font-bold text-white hover:opacity-90"
        >
          추가 상품보기
        </Link>
        <Link
          href="/apply"
          style={{ backgroundColor: accentColor }}
          className="flex-1 border-l border-white/20 py-3.5 text-center text-sm font-bold text-white hover:opacity-90"
        >
          신청서 작성
        </Link>
      </div>
    </article>
  );
}
