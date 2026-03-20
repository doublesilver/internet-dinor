"use client";

import { useSearchParams } from "next/navigation";

function fmt(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}

interface CalculatorPriceOverrideProps {
  fallbackSpeed: string;
  fallbackPrice: string;
}

export function CalculatorPriceOverride({ fallbackSpeed, fallbackPrice }: CalculatorPriceOverrideProps) {
  const sp = useSearchParams();

  const total = parseInt(sp.get("total") ?? "", 10);
  const iLabel = sp.get("iLabel");
  const iSpeed = sp.get("iSpeed");
  const iPrice = parseInt(sp.get("iPrice") ?? "", 10);
  const tLabel = sp.get("tLabel");
  const tPrice = parseInt(sp.get("tPrice") ?? "", 10);
  const mLabel = sp.get("mLabel");
  const mDiscount = parseInt(sp.get("mDiscount") ?? "", 10);

  const hasCalc = !isNaN(total) && iLabel && iSpeed;

  if (!hasCalc) {
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
        <p className="mt-2 text-lg font-bold text-brand-graphite">{iSpeed}</p>
      </div>
      <div className="rounded-2xl bg-brand-surface p-4">
        <p className="text-sm text-brand-slate">월 이용료</p>
        <p className="mt-2 text-lg font-bold text-brand-orange">{fmt(total)}</p>
      </div>
      <div className="col-span-full mt-1 grid gap-2 md:grid-cols-3">
        <div className="rounded-2xl border border-brand-border p-3">
          <p className="text-xs text-brand-slate">인터넷</p>
          <p className="mt-1 text-sm font-bold text-brand-graphite">{iLabel}</p>
          <p className="text-sm font-semibold text-brand-orange">{fmt(iPrice)}</p>
        </div>
        <div className="rounded-2xl border border-brand-border p-3">
          <p className="text-xs text-brand-slate">TV</p>
          <p className="mt-1 text-sm font-bold text-brand-graphite">{tLabel ?? "미결합"}</p>
          <p className="text-sm font-semibold text-brand-orange">
            {(tPrice ?? 0) > 0 ? `+${fmt(tPrice)}` : "없음"}
          </p>
        </div>
        <div className="rounded-2xl border border-brand-border p-3">
          <p className="text-xs text-brand-slate">휴대폰 결합</p>
          <p className="mt-1 text-sm font-bold text-brand-graphite">{mLabel ?? "미결합"}</p>
          <p className="text-sm font-semibold text-brand-orange">
            {(mDiscount ?? 0) < 0 ? `-${fmt(Math.abs(mDiscount))}` : "할인 없음"}
          </p>
        </div>
      </div>
    </>
  );
}
