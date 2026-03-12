import { ProductEditorForm } from "@/components/admin/ProductEditorForm";
import { getCarriers } from "@/lib/repositories/content";
import type { Product } from "@/types/domain";

export default async function AdminNewProductPage() {
  const carriers = await getCarriers();

  const emptyProduct: Product = {
    id: "",
    carrierId: carriers[0]?.id ?? "",
    slug: "",
    name: "",
    summary: "",
    description: "",
    bundleType: "internet_only",
    internetSpeed: "100M",
    tvIncluded: false,
    monthlyPriceLabel: "",
    benefitLabel: "",
    badgeTags: [],
    targetTags: [],
    heroPoints: [],
    detailSections: [],
    faqItems: [],
    isFeatured: false,
    status: "draft",
    sortOrder: 0
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-orange">New Product</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">신규 상품 등록</h1>
      </div>
      <ProductEditorForm product={emptyProduct} carriers={carriers} mode="create" />
    </div>
  );
}
