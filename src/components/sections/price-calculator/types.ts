import type { Product } from "@/types/domain";

export type PriceCalculatorProducts = [Product, ...Product[]];

export interface PriceCalculatorProps {
  carrierSlug: string;
  carrierName: string;
  products: Product[];
}

export interface PriceCalculatorClientProps {
  carrierSlug: string;
  carrierName: string;
  accentColor: string;
  products: PriceCalculatorProducts;
}

export function hasPriceCalculatorProducts(products: Product[]): products is PriceCalculatorProducts {
  return products.length > 0;
}
