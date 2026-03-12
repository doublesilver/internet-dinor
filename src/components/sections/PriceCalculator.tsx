"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/domain";
import { getBundleTypeLabel } from "@/lib/utils/labels";

type PriceCalculatorProps = {
  carrierName: string;
  accentColor?: string;
  products: Product[];
};

export function PriceCalculator({ carrierName, accentColor = "#f15c2d", products }: PriceCalculatorProps) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");

  if (products.length === 0) {
    return (
      <div className="rounded-[20px] bg-white p-8 text-center text-sm text-brand-slate shadow-lg">
        현재 비교 가능한 {carrierName} 상품이 없습니다.
      </div>
    );
  }

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0];

  return (
    <div className="overflow-hidden rounded-[20px] bg-white shadow-lg">
      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,280px)_1fr]">
        <div className="space-y-3">
          <p className="text-sm font-bold text-brand-graphite">{carrierName} 등록 상품 기준 비교</p>
          <p className="text-sm leading-6 text-brand-slate">
            현재 관리자에 등록된 공개 상품만 기준으로 비교합니다. 요금, 구성, 혜택 정보가 동일한 데이터 소스를 사용합니다.
          </p>
          <label className="field-label">상품 선택</label>
          <select
            className="field-base"
            value={selectedProduct.id}
            onChange={(event) => setSelectedProductId(event.target.value)}
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <div className="rounded-2xl bg-brand-surface p-4 text-sm text-brand-slate">
            <p className="font-semibold text-brand-graphite">현재 선택</p>
            <p className="mt-1">{selectedProduct.summary}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-brand-border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold" style={{ color: accentColor }}>
                  {carrierName}
                </p>
                <h3 className="mt-1 text-2xl font-black text-brand-graphite">{selectedProduct.name}</h3>
              </div>
              <div className="text-right">
                {selectedProduct.originalPriceLabel ? (
                  <p className="text-sm text-brand-slate line-through">월 {selectedProduct.originalPriceLabel}</p>
                ) : null}
                <p className="text-sm text-brand-slate">
                  월 <strong className="text-3xl font-black" style={{ color: accentColor }}>{selectedProduct.monthlyPriceLabel}</strong>
                </p>
                <p className="mt-1 text-xs text-brand-slate">등록된 공개 상품 기준</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-brand-surface p-4">
              <p className="text-sm text-brand-slate">인터넷 속도</p>
              <p className="mt-2 text-lg font-bold text-brand-graphite">{selectedProduct.internetSpeed || "-"}</p>
            </div>
            <div className="rounded-2xl bg-brand-surface p-4">
              <p className="text-sm text-brand-slate">구성</p>
              <p className="mt-2 text-lg font-bold text-brand-graphite">{getBundleTypeLabel(selectedProduct.bundleType)}</p>
            </div>
            <div className="rounded-2xl bg-brand-surface p-4">
              <p className="text-sm text-brand-slate">혜택</p>
              <p className="mt-2 text-lg font-bold text-brand-graphite">{selectedProduct.benefitLabel}</p>
            </div>
          </div>

          {selectedProduct.heroPoints.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {selectedProduct.heroPoints.map((point) => (
                <div key={point} className="rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-slate">
                  {point}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row" style={{ backgroundColor: accentColor }}>
        <p className="text-center text-white sm:text-left">
          <span className="text-lg font-medium">실제 공개 상품 기준 월 요금</span>
          <strong className="ml-3 text-4xl font-black">{selectedProduct.monthlyPriceLabel}</strong>
        </p>
        <div className="flex gap-3">
          <Link
            href={`/products/${selectedProduct.slug}`}
            className="rounded-full bg-white px-6 py-3 text-sm font-bold hover:bg-gray-100"
            style={{ color: accentColor }}
          >
            상품 상세 보기
          </Link>
          <Link
            href="/apply"
            className="rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
          >
            신청서 작성
          </Link>
        </div>
      </div>
    </div>
  );
}
