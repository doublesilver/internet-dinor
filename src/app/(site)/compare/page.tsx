import type { Metadata } from "next";
import { ProductCard } from "@/components/sections/ProductCard";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { getProducts } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "대표 상품 비교",
  description: "인터넷/TV 대표 상품을 한눈에 비교하고 맞춤 상담을 받아보세요."
};

export default async function ComparePage() {
  const products = await getProducts();

  return (
    <section className="section-space">
      <div className="container-page">
        <SectionHeading
          eyebrow="Compare"
          title="대표 상품 비교"
          description="KT, SK, LG, SKY, 헬로비전 대표 인터넷/TV 상품을 한눈에 비교하고 나에게 맞는 상품으로 맞춤 상담을 받아보세요."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
