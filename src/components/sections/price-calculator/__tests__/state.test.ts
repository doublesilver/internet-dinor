import { describe, expect, it } from "vitest";
import { productsSeed } from "@/data/seeds";
import { getDefaultSelectedProductId, getResolvedSelectedProductId, getSelectedProduct } from "@/components/sections/price-calculator/state";
import type { PriceCalculatorProducts } from "@/components/sections/price-calculator/types";

const sampleProducts = productsSeed.slice(0, 2) as PriceCalculatorProducts;

describe("price calculator state helpers", () => {
  it("returns the first product as the default selection", () => {
    expect(getDefaultSelectedProductId(sampleProducts)).toBe(sampleProducts[0].id);
    expect(getDefaultSelectedProductId([])).toBe("");
  });

  it("keeps the current selection when it still exists", () => {
    expect(getResolvedSelectedProductId(sampleProducts, sampleProducts[1].id)).toBe(sampleProducts[1].id);
  });

  it("falls back to the first product when the selection is missing", () => {
    expect(getResolvedSelectedProductId(sampleProducts, "missing-product")).toBe(sampleProducts[0].id);
    expect(getResolvedSelectedProductId([], "missing-product")).toBe("");
  });

  it("returns the selected product and falls back to the first entry", () => {
    expect(getSelectedProduct(sampleProducts, sampleProducts[1].id)).toEqual(sampleProducts[1]);
    expect(getSelectedProduct(sampleProducts, "missing-product")).toEqual(sampleProducts[0]);
  });
});
