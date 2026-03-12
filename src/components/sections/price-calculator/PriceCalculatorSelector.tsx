import type { Product } from "@/types/domain";

interface PriceCalculatorSelectorProps {
  carrierName: string;
  products: Product[];
  selectedProductId: string;
  selectedSummary: string;
  onChange: (productId: string) => void;
}

export function PriceCalculatorSelector({
  carrierName,
  products,
  selectedProductId,
  selectedSummary,
  onChange
}: PriceCalculatorSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-brand-graphite">{carrierName} 등록 상품 기준 비교</p>
      <p className="text-sm leading-6 text-brand-slate">
        현재 관리자에 등록된 공개 상품만 기준으로 비교합니다. 요금, 구성, 혜택 정보가 동일한 데이터 소스를 사용합니다.
      </p>
      <label className="field-label">상품 선택</label>
      <select className="field-base" value={selectedProductId} onChange={(event) => onChange(event.target.value)}>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      <div className="rounded-2xl bg-brand-surface p-4 text-sm text-brand-slate">
        <p className="font-semibold text-brand-graphite">현재 선택</p>
        <p className="mt-1">{selectedSummary}</p>
      </div>
    </div>
  );
}
