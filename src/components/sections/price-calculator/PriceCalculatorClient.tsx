"use client";

import { useState } from "react";
import { PriceCalculatorFooter } from "@/components/sections/price-calculator/PriceCalculatorFooter";
import { PriceCalculatorSelector, type CalculatorSelection } from "@/components/sections/price-calculator/PriceCalculatorSelector";
import { formatPrice, getCarrierPriceData } from "@/components/sections/price-calculator/priceData";
import type { PriceCalculatorClientProps } from "@/components/sections/price-calculator/types";

export function PriceCalculatorClient({ carrierName, accentColor, products, carrierSlug }: PriceCalculatorClientProps) {
  const priceData = getCarrierPriceData(carrierSlug);

  const [selection, setSelection] = useState<CalculatorSelection>({
    internetIndex: 0,
    tvIndex: 0,
    mobileIndex: 0
  });

  if (!priceData) {
    return null;
  }

  const internetPrice = priceData.internetOptions[selection.internetIndex]?.price ?? 0;
  const tvPrice = priceData.tvOptions[selection.tvIndex]?.price ?? 0;
  const mobileDiscount = priceData.mobileOptions[selection.mobileIndex]?.discount ?? 0;
  const totalPrice = Math.max(0, internetPrice + tvPrice + mobileDiscount);

  const selectedInternet = priceData.internetOptions[selection.internetIndex];
  const selectedTv = priceData.tvOptions[selection.tvIndex];
  const selectedMobile = priceData.mobileOptions[selection.mobileIndex];

  const summaryParts = [selectedInternet?.label ?? ""];
  if (selectedTv && selectedTv.price > 0) summaryParts.push(`TV ${selectedTv.label}`);
  if (selectedMobile && selectedMobile.discount !== 0) summaryParts.push(`휴대폰 ${selectedMobile.label}`);
  const summaryText = summaryParts.join(" + ");

  return (
    <div className="overflow-hidden rounded-[20px] bg-white shadow-lg">
      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,320px)_1fr]">
        <PriceCalculatorSelector
          accentColor={accentColor}
          priceData={priceData}
          selection={selection}
          onChange={setSelection}
        />

        <div className="space-y-3">
          <div className="rounded-2xl border border-brand-border p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold" style={{ color: accentColor }}>
                  {carrierName}
                </p>
                <h3 className="mt-1 text-lg font-black text-brand-graphite">{summaryText}</h3>
              </div>
              <div className="text-right">
                <p className="text-sm text-brand-slate">월 예상 요금</p>
                <p>
                  <strong className="text-3xl font-black" style={{ color: accentColor }}>
                    {formatPrice(totalPrice)}
                  </strong>
                </p>
                <p className="mt-1 text-xs text-brand-slate">3년 약정 기준 참고 요금</p>
              </div>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            <div className="rounded-2xl bg-brand-surface p-4">
              <p className="text-sm text-brand-slate">인터넷 속도</p>
              <p className="mt-2 text-lg font-bold text-brand-graphite">{selectedInternet?.speed ?? "-"}</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: accentColor }}>
                {formatPrice(internetPrice)}
              </p>
            </div>
            <div className="rounded-2xl bg-brand-surface p-4">
              <p className="text-sm text-brand-slate">TV 상품</p>
              <p className="mt-2 text-lg font-bold text-brand-graphite">{selectedTv?.label ?? "-"}</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: accentColor }}>
                {tvPrice > 0 ? `+${formatPrice(tvPrice)}` : "없음"}
              </p>
            </div>
            <div className="rounded-2xl bg-brand-surface p-4">
              <p className="text-sm text-brand-slate">휴대폰 결합</p>
              <p className="mt-2 text-lg font-bold text-brand-graphite">{selectedMobile?.label ?? "-"}</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: accentColor }}>
                {mobileDiscount < 0 ? `-${formatPrice(Math.abs(mobileDiscount))}` : "할인 없음"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <PriceCalculatorFooter
        accentColor={accentColor}
        monthlyPriceLabel={formatPrice(totalPrice)}
        productSlug={products[0]?.slug ?? ""}
      />
    </div>
  );
}
