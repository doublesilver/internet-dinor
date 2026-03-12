import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { ProductCard } from "@/components/sections/ProductCard";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { getProducts, getSiteSettings } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "대표 상품 비교",
  description: "인터넷/TV 대표 상품을 한눈에 비교하고 맞춤 상담을 받아보세요."
};

export default async function ComparePage() {
  const [settings, products] = await Promise.all([getSiteSettings(), getProducts()]);

  return (
    <SiteShell settings={settings}>
      <section className="section-space">
        <div className="container-page">
          <SectionHeading
            eyebrow="Compare"
            title="대표 상품 비교"
            description="1차 제작물에서는 가상 데이터를 기준으로 비교 구조를 먼저 검증하고, 실제 운영 전 데이터만 교체할 수 있게 설계합니다."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
