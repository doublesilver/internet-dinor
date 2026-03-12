"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/domain";

export function usePriceCalculator(products: Product[]) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");

  useEffect(() => {
    if (products.length === 0) {
      setSelectedProductId("");
      return;
    }

    const hasSelectedProduct = products.some((product) => product.id === selectedProductId);
    if (!hasSelectedProduct) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0];

  return {
    selectedProduct,
    selectedProductId,
    setSelectedProductId
  };
}
