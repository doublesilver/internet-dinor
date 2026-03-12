"use client";

import { useEffect, useState } from "react";
import { getResolvedSelectedProductId, getSelectedProduct } from "@/components/sections/price-calculator/state";
import type { PriceCalculatorProducts } from "@/components/sections/price-calculator/types";

export function usePriceCalculator(products: PriceCalculatorProducts) {
  const [selectedProductId, setSelectedProductId] = useState(() => getResolvedSelectedProductId(products, ""));

  useEffect(() => {
    const resolvedSelectedProductId = getResolvedSelectedProductId(products, selectedProductId);
    if (resolvedSelectedProductId !== selectedProductId) {
      setSelectedProductId(resolvedSelectedProductId);
    }
  }, [products, selectedProductId]);

  const selectedProduct = getSelectedProduct(products, selectedProductId);

  return {
    selectedProduct,
    selectedProductId,
    setSelectedProductId
  };
}
