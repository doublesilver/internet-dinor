import type { Product } from "@/types/domain";
import type { PriceCalculatorProducts } from "@/components/sections/price-calculator/types";

export function getDefaultSelectedProductId(products: readonly Product[]): string {
  return products[0]?.id ?? "";
}

export function getResolvedSelectedProductId(products: readonly Product[], selectedProductId: string): string {
  if (products.length === 0) {
    return "";
  }

  const hasSelectedProduct = products.some((product) => product.id === selectedProductId);
  return hasSelectedProduct ? selectedProductId : getDefaultSelectedProductId(products);
}

export function getSelectedProduct(products: PriceCalculatorProducts, selectedProductId: string) {
  return products.find((product) => product.id === selectedProductId) ?? products[0];
}
