"use client";

import { useSearchParams } from "next/navigation";

function fmt(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}

interface CalculatorPriceOverrideProps {
  fallbackSpeed: string;
  fallbackPrice: string;
}

export function useCalcParams() {
  const sp = useSearchParams();

  const total = parseInt(sp.get("total") ?? "", 10);
  const iLabel = sp.get("iLabel");
  const iSpeed = sp.get("iSpeed");

  if (isNaN(total) || !iLabel || !iSpeed) return null;

  return {
    carrierName: sp.get("carrier") ?? "",
    summary: sp.get("summary") ?? "",
    iLabel,
    iSpeed,
    iPrice: parseInt(sp.get("iPrice") ?? "0", 10),
    tLabel: sp.get("tLabel") ?? "미결합",
    tPrice: parseInt(sp.get("tPrice") ?? "0", 10),
    mLabel: sp.get("mLabel") ?? "미결합",
    mDiscount: parseInt(sp.get("mDiscount") ?? "0", 10),
    total,
  };
}

/** Overrides the product title & breadcrumb when calculator params are present */
export function CalculatorHeaderOverride({ fallbackName }: { fallbackName: string }) {
  const calc = useCalcParams();

  if (!calc) {
    return (
      <>
        <p className="text-sm font-semibold text-brand-orange">홈 &gt; 상품 상세 &gt; {fallbackName}</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-brand-graphite">{fallbackName}</h1>
      </>
    );
  }

  const displayName = `${calc.carrierName} ${calc.summary}`;

  return (
    <>
      <p className="text-sm font-semibold text-brand-orange">홈 &gt; 상품 상세 &gt; {displayName}</p>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-brand-graphite">{displayName}</h1>
    </>
  );
}

/** Overrides speed + price grid cells when calculator params are present */
export function CalculatorPriceOverride({ fallbackSpeed, fallbackPrice }: CalculatorPriceOverrideProps) {
  const calc = useCalcParams();

  if (!calc) {
    return (
      <>
        <div className="rounded-2xl bg-brand-surface p-4">
          <p className="text-sm text-brand-slate">속도</p>
          <p className="mt-2 text-lg font-bold text-brand-graphite">{fallbackSpeed}</p>
        </div>
        <div className="rounded-2xl bg-brand-surface p-4">
          <p className="text-sm text-brand-slate">월 이용료</p>
          <p className="mt-2 text-lg font-bold text-brand-orange">{fallbackPrice}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="rounded-2xl bg-brand-surface p-4">
        <p className="text-sm text-brand-slate">속도</p>
        <p className="mt-2 text-lg font-bold text-brand-graphite">{calc.iSpeed}</p>
      </div>
      <div className="rounded-2xl bg-brand-surface p-4">
        <p className="text-sm text-brand-slate">월 이용료</p>
        <p className="mt-2 text-lg font-bold text-brand-orange">{fmt(calc.total)}</p>
      </div>
      <div className="col-span-full mt-1 grid gap-2 md:grid-cols-3">
        <div className="rounded-2xl border border-brand-border p-3">
          <p className="text-xs text-brand-slate">인터넷</p>
          <p className="mt-1 text-sm font-bold text-brand-graphite">{calc.iLabel}</p>
          <p className="text-sm font-semibold text-brand-orange">{fmt(calc.iPrice)}</p>
        </div>
        <div className="rounded-2xl border border-brand-border p-3">
          <p className="text-xs text-brand-slate">TV</p>
          <p className="mt-1 text-sm font-bold text-brand-graphite">{calc.tLabel}</p>
          <p className="text-sm font-semibold text-brand-orange">
            {calc.tPrice > 0 ? `+${fmt(calc.tPrice)}` : "없음"}
          </p>
        </div>
        <div className="rounded-2xl border border-brand-border p-3">
          <p className="text-xs text-brand-slate">휴대폰 결합</p>
          <p className="mt-1 text-sm font-bold text-brand-graphite">{calc.mLabel}</p>
          <p className="text-sm font-semibold text-brand-orange">
            {calc.mDiscount < 0 ? `-${fmt(Math.abs(calc.mDiscount))}` : "할인 없음"}
          </p>
        </div>
      </div>
    </>
  );
}
