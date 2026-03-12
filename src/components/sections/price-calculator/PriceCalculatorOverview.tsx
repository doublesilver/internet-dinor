import type { Product } from "@/types/domain";
import { getBundleTypeLabel } from "@/lib/utils/labels";

interface PriceCalculatorOverviewProps {
  accentColor: string;
  carrierName: string;
  product: Product;
}

export function PriceCalculatorOverview({ accentColor, carrierName, product }: PriceCalculatorOverviewProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand-border p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: accentColor }}>
              {carrierName}
            </p>
            <h3 className="mt-1 text-2xl font-black text-brand-graphite">{product.name}</h3>
          </div>
          <div className="text-right">
            {product.originalPriceLabel ? (
              <p className="text-sm text-brand-slate line-through">월 {product.originalPriceLabel}</p>
            ) : null}
            <p className="text-sm text-brand-slate">
              월{" "}
              <strong className="text-3xl font-black" style={{ color: accentColor }}>
                {product.monthlyPriceLabel}
              </strong>
            </p>
            <p className="mt-1 text-xs text-brand-slate">등록된 공개 상품 기준</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-brand-surface p-4">
          <p className="text-sm text-brand-slate">인터넷 속도</p>
          <p className="mt-2 text-lg font-bold text-brand-graphite">{product.internetSpeed || "-"}</p>
        </div>
        <div className="rounded-2xl bg-brand-surface p-4">
          <p className="text-sm text-brand-slate">구성</p>
          <p className="mt-2 text-lg font-bold text-brand-graphite">{getBundleTypeLabel(product.bundleType)}</p>
        </div>
        <div className="rounded-2xl bg-brand-surface p-4">
          <p className="text-sm text-brand-slate">혜택</p>
          <p className="mt-2 text-lg font-bold text-brand-graphite">{product.benefitLabel}</p>
        </div>
      </div>
    </div>
  );
}
