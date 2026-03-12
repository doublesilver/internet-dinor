"use client";

import { PriceCalculatorFooter } from "@/components/sections/price-calculator/PriceCalculatorFooter";
import { PriceCalculatorHighlights } from "@/components/sections/price-calculator/PriceCalculatorHighlights";
import { PriceCalculatorOverview } from "@/components/sections/price-calculator/PriceCalculatorOverview";
import { PriceCalculatorSelector } from "@/components/sections/price-calculator/PriceCalculatorSelector";
import type { PriceCalculatorClientProps } from "@/components/sections/price-calculator/types";
import { usePriceCalculator } from "@/components/sections/price-calculator/usePriceCalculator";

export function PriceCalculatorClient({ carrierName, accentColor, products }: PriceCalculatorClientProps) {
  const { selectedProduct, selectedProductId, setSelectedProductId } = usePriceCalculator(products);

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
