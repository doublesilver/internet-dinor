import Link from "next/link";

interface PriceCalculatorFooterProps {
  accentColor: string;
  monthlyPriceLabel: string;
  productSlug: string;
}

export function PriceCalculatorFooter({ accentColor, monthlyPriceLabel, productSlug }: PriceCalculatorFooterProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row" style={{ backgroundColor: accentColor }}>
      <p className="text-center text-white sm:text-left">
        <span className="text-lg font-medium">실제 공개 상품 기준 월 요금</span>
        <strong className="ml-3 text-4xl font-black">{monthlyPriceLabel}</strong>
      </p>
      <div className="flex gap-3">
        <Link
          href={`/products/${productSlug}`}
          className="rounded-full bg-white px-6 py-3 text-sm font-bold hover:bg-gray-100"
          style={{ color: accentColor }}
        >
          상품 상세 보기
        </Link>
        <Link
          href="/apply"
          className="rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
        >
          신청서 작성
        </Link>
      </div>
    </div>
  );
}
