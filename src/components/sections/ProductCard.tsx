import type { Product } from "@/types/domain";
import { Button } from "@/components/ui/Button";

const bundleLabel: Record<string, string> = {
  internet_only: "인터넷 단독",
  internet_tv: "인터넷 + TV",
  business: "사업장용",
  custom: "기타"
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="surface-card flex h-full flex-col">
      <div className="mb-4 flex flex-wrap gap-2">
        {product.badgeTags.map((tag) => (
          <span key={tag} className="rounded-full bg-brand-lavender-soft px-3 py-1 text-xs font-semibold text-brand-graphite">
            {tag}
          </span>
        ))}
      </div>
      <h3 className="text-xl font-bold text-brand-graphite">{product.name}</h3>
      <p className="mt-2 text-sm leading-6 text-brand-slate">{product.summary}</p>
      <dl className="mt-6 space-y-3 text-sm text-brand-slate">
        <div className="flex items-center justify-between gap-4">
          <dt>구성</dt>
          <dd className="font-semibold text-brand-graphite">{bundleLabel[product.bundleType] ?? "인터넷 단독"}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt>속도</dt>
          <dd className="font-semibold text-brand-graphite">{product.internetSpeed}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt>월 요금</dt>
          <dd className="font-semibold text-brand-orange">{product.monthlyPriceLabel}</dd>
        </div>
      </dl>
      <p className="mt-4 rounded-2xl bg-brand-sky-soft px-4 py-3 text-sm text-brand-graphite">{product.benefitLabel}</p>
      <div className="mt-auto pt-6">
        <Button href={`/products/${product.slug}`} fullWidth>
          이 상품 문의하기
        </Button>
      </div>
    </article>
  );
}
