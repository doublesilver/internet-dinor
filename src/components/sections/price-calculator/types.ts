import type { CarrierPriceData, Product } from "@/types/domain";

export type PriceCalculatorProducts = [Product, ...Product[]];

export interface PriceCalculatorProps {
  carrierSlug: string;
  carrierName: string;
  products: Product[];
  priceData?: CarrierPriceData;
}

export interface PriceCalculatorClientProps {
  carrierSlug: string;
  carrierName: string;
  accentColor: string;
  products: PriceCalculatorProducts;
  priceData?: CarrierPriceData;
}

export function hasPriceCalculatorProducts(products: Product[]): products is PriceCalculatorProducts {
  return products.length > 0;
}
