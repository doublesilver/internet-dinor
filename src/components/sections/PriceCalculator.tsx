"use client";

import type { Product } from "@/types/domain";
import { PriceCalculatorFooter } from "@/components/sections/price-calculator/PriceCalculatorFooter";
import { PriceCalculatorHighlights } from "@/components/sections/price-calculator/PriceCalculatorHighlights";
import { PriceCalculatorOverview } from "@/components/sections/price-calculator/PriceCalculatorOverview";
import { PriceCalculatorSelector } from "@/components/sections/price-calculator/PriceCalculatorSelector";
import { usePriceCalculator } from "@/components/sections/price-calculator/usePriceCalculator";

type PriceCalculatorProps = {
  carrierName: string;
  accentColor?: string;
  products: Product[];
};

export function PriceCalculator({ carrierName, accentColor = "#f15c2d", products }: PriceCalculatorProps) {
  const { selectedProduct, selectedProductId, setSelectedProductId } = usePriceCalculator(products);

  if (products.length === 0) {
    return (
      <div className="rounded-[20px] bg-white p-8 text-center text-sm text-brand-slate shadow-lg">
        현재 비교 가능한 {carrierName} 상품이 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] bg-white shadow-lg">
      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,280px)_1fr]">
        <PriceCalculatorSelector
          carrierName={carrierName}
          products={products}
          selectedProductId={selectedProductId}
          selectedSummary={selectedProduct.summary}
          onChange={setSelectedProductId}
        />

        <div className="space-y-4">
          <PriceCalculatorOverview accentColor={accentColor} carrierName={carrierName} product={selectedProduct} />
          <PriceCalculatorHighlights heroPoints={selectedProduct.heroPoints} />
        </div>
      </div>

      <PriceCalculatorFooter
        accentColor={accentColor}
        monthlyPriceLabel={selectedProduct.monthlyPriceLabel}
        productSlug={selectedProduct.slug}
      />
    </div>
  );
}
