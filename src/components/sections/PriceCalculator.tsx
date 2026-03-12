import { getCarrierAccentColor } from "@/lib/constants/carriers";
import { PriceCalculatorClient } from "@/components/sections/price-calculator/PriceCalculatorClient";
import { PriceCalculatorEmptyState } from "@/components/sections/price-calculator/PriceCalculatorEmptyState";
import { hasPriceCalculatorProducts, type PriceCalculatorProps } from "@/components/sections/price-calculator/types";

export function PriceCalculator({ carrierSlug, carrierName, products }: PriceCalculatorProps) {
  if (!hasPriceCalculatorProducts(products)) {
    return <PriceCalculatorEmptyState carrierName={carrierName} />;
  }

  const accentColor = getCarrierAccentColor(carrierSlug);

  return <PriceCalculatorClient carrierName={carrierName} accentColor={accentColor} products={products} />;
}
