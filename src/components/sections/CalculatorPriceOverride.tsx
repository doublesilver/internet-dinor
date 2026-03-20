"use client";

import { useSearchParams } from "next/navigation";
import { formatPrice, getCarrierPriceData } from "@/components/sections/price-calculator/priceData";

interface CalculatorPriceOverrideProps {
  /** Fallback value when no calculator params present */
  fallbackSpeed: string;
  fallbackPrice: string;
}

export function CalculatorPriceOverride({ fallbackSpeed, fallbackPrice }: CalculatorPriceOverrideProps) {
  const searchParams = useSearchParams();

  const carrier = searchParams.get("carrier");
  const internetIdx = parseInt(searchParams.get("internet") ?? "", 10);
  const tvIdx = parseInt(searchParams.get("tv") ?? "", 10);
  const mobileIdx = parseInt(searchParams.get("mobile") ?? "", 10);

  if (!carrier || isNaN(internetIdx) || isNaN(tvIdx) || isNaN(mobileIdx)) {
    return <FallbackDisplay speed={fallbackSpeed} price={fallbackPrice} />;
  }

  const priceData = getCarrierPriceData(carrier);
  if (!priceData) {
    return <FallbackDisplay speed={fallbackSpeed} price={fallbackPrice} />;
  }

  const internet = priceData.internetOptions[internetIdx];
  const tv = priceData.tvOptions[tvIdx];
  const mobile = priceData.mobileOptions[mobileIdx];

  if (!internet) {
    return <FallbackDisplay speed={fallbackSpeed} price={fallbackPrice} />;
  }

  const internetPrice = internet.price;
  const tvPrice = tv?.price ?? 0;
  const mobileDiscount = mobile?.discount ?? 0;
  const totalPrice = Math.max(0, internetPrice + tvPrice + mobileDiscount);

  return (
    <>
      <div className="rounded-2xl bg-brand-surface p-4">
        <p className="text-sm text-brand-slate">속도</p>
        <p className="mt-2 text-lg font-bold text-brand-graphite">{internet.speed}</p>
      </div>
      <div className="rounded-2xl bg-brand-surface p-4">
        <p className="text-sm text-brand-slate">월 이용료</p>
        <p className="mt-2 text-lg font-bold text-brand-orange">{formatPrice(totalPrice)}</p>
      </div>
      <div className="col-span-full mt-1 grid gap-2 md:grid-cols-3">
        <div className="rounded-2xl border border-brand-border p-3">
          <p className="text-xs text-brand-slate">인터넷</p>
          <p className="mt-1 text-sm font-bold text-brand-graphite">{internet.label}</p>
          <p className="text-sm font-semibold text-brand-orange">{formatPrice(internetPrice)}</p>
        </div>
        <div className="rounded-2xl border border-brand-border p-3">
          <p className="text-xs text-brand-slate">TV</p>
          <p className="mt-1 text-sm font-bold text-brand-graphite">{tv?.label ?? "미결합"}</p>
          <p className="text-sm font-semibold text-brand-orange">
            {tvPrice > 0 ? `+${formatPrice(tvPrice)}` : "없음"}
          </p>
        </div>
        <div className="rounded-2xl border border-brand-border p-3">
          <p className="text-xs text-brand-slate">휴대폰 결합</p>
          <p className="mt-1 text-sm font-bold text-brand-graphite">{mobile?.label ?? "미결합"}</p>
          <p className="text-sm font-semibold text-brand-orange">
            {mobileDiscount < 0 ? `-${formatPrice(Math.abs(mobileDiscount))}` : "할인 없음"}
          </p>
        </div>
      </div>
    </>
  );
}

function FallbackDisplay({ speed, price }: { speed: string; price: string }) {
  return (
    <>
      <div className="rounded-2xl bg-brand-surface p-4">
        <p className="text-sm text-brand-slate">속도</p>
        <p className="mt-2 text-lg font-bold text-brand-graphite">{speed}</p>
      </div>
      <div className="rounded-2xl bg-brand-surface p-4">
        <p className="text-sm text-brand-slate">월 이용료</p>
        <p className="mt-2 text-lg font-bold text-brand-orange">{price}</p>
      </div>
    </>
  );
}
