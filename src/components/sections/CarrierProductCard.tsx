import Image from "next/image";
import Link from "next/link";
import { getCarrierTheme } from "@/lib/constants/carriers";

interface CarrierProductCardProps {
  carrierSlug: string;
  productName: string;
  speed: string;
  channelCount?: string;
  originalPrice?: string;
  discountPrice: string;
  giftAmount?: string;
}

export function CarrierProductCard({
  carrierSlug,
  productName,
  speed,
  channelCount,
  originalPrice,
  discountPrice,
  giftAmount
}: CarrierProductCardProps) {
  const theme = getCarrierTheme(carrierSlug);

  return (
    <article className="flex flex-col overflow-hidden rounded-[30px] bg-white shadow-[4px_4px_2px_rgba(0,0,0,0.1)]">
      {/* Carrier logo */}
      <div className={`flex items-center justify-center border-b border-brand-border py-4 ${carrierSlug === "hellovision" ? "px-0" : "px-4"}`}>
        <Image
          src={theme.logoPath}
          alt={theme.logoAlt}
          width={180}
          height={60}
          className={carrierSlug === "hellovision" ? "w-full h-auto object-contain" : "h-10 w-auto object-contain"}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 py-4 text-center">
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
          <span style={{ color: theme.accentColor }} className="text-lg">
            월 <strong className="text-2xl">{discountPrice}</strong>
          </span>
        </div>
      </div>

      {/* CTA buttons - per carrier color */}
      <div className="flex">
        <Link
          href={`/carriers/${carrierSlug}`}
          style={{ backgroundColor: theme.accentColor }}
          className="flex-1 py-3.5 text-center text-sm font-bold text-white hover:opacity-90"
        >
          추가 상품보기
        </Link>
        <Link
          href="/apply"
          style={{ backgroundColor: theme.accentColor }}
          className="flex-1 border-l border-white/20 py-3.5 text-center text-sm font-bold text-white hover:opacity-90"
        >
          신청서 작성
        </Link>
      </div>
    </article>
  );
}
