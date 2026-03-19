import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductInquiryForm } from "@/components/forms/ProductInquiryForm";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getProductBySlug, getProducts, getSiteSettings } from "@/lib/repositories/content";
import { getBundleTypeLabel } from "@/lib/utils/labels";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ productSlug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ productSlug: string }> }): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.summary,
    openGraph: { title: product.name, description: product.summary }
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ productSlug: string }> }) {
  const { productSlug } = await params;
  const [product, settings] = await Promise.all([getProductBySlug(productSlug), getSiteSettings()]);

  if (!product) notFound();

  return (
    <>
      <section className="py-8 md:py-12 bg-brand-sky-soft">
        <div className="container-page grid gap-5 lg:grid-cols-[1fr_minmax(0,420px)]">
          <div className="surface-card bg-white">
            <p className="text-sm font-semibold text-brand-orange">홈 &gt; 상품 상세 &gt; {product.name}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {product.badgeTags.map((tag) => (
                <span key={tag} className="rounded-full bg-brand-lavender-soft px-3 py-1 text-xs font-semibold text-brand-graphite">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-brand-graphite">{product.name}</h1>
            <p className="mt-4 text-base leading-7 text-brand-slate">{product.description}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-brand-surface p-4">
                <p className="text-sm text-brand-slate">속도</p>
                <p className="mt-2 text-lg font-bold text-brand-graphite">{product.internetSpeed}</p>
              </div>
              <div className="rounded-2xl bg-brand-surface p-4">
                <p className="text-sm text-brand-slate">구성</p>
                <p className="mt-2 text-lg font-bold text-brand-graphite">{getBundleTypeLabel(product.bundleType)}</p>
              </div>
              <div className="rounded-2xl bg-brand-surface p-4">
                <p className="text-sm text-brand-slate">월 이용료</p>
                <p className="mt-2 text-lg font-bold text-brand-orange">{product.monthlyPriceLabel}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="#inquiry">이 상품 문의하기</Button>
              <Button href={settings.phoneLink} variant="secondary">
                전화 상담
              </Button>
            </div>
          </div>
          <div className="surface-card bg-white">
            <h2 className="text-xl font-bold text-brand-graphite">핵심 포인트</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-brand-slate">
              {product.heroPoints.map((point) => (
                <li key={point} className="rounded-2xl bg-brand-lavender-soft px-4 py-3 text-brand-graphite">
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl bg-brand-sky-soft px-4 py-3 text-sm text-brand-graphite">{product.benefitLabel}</p>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-page">
          <SectionHeading title="상품 안내" description="기획안 기준으로 추천 대상, 비교 포인트, 유의사항을 블록형 섹션으로 확장 가능하게 설계했습니다." />
          <div className="grid gap-5 md:grid-cols-2">
            {product.detailSections.map((section) => (
              <article key={section.title} className="surface-card">
                <h3 className="text-xl font-bold text-brand-graphite">{section.title}</h3>
                <p className="mt-3 text-sm leading-6 text-brand-slate">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="inquiry" className="py-8 md:py-12 bg-brand-lavender-soft/40">
        <div className="container-page grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <SectionHeading title="이 상품 기준으로 상담받기" description="상품 상세 폼은 공통 필드 + payload 확장 구조로 설계해 후속 운영 시 필드 추가가 쉽습니다." />
            <div className="surface-card">
              <h3 className="text-lg font-bold text-brand-graphite">자주 묻는 질문</h3>
              <div className="mt-4 space-y-4">
                {product.faqItems.map((item) => (
                  <div key={item.q} className="rounded-2xl border border-brand-border p-4">
                    <p className="font-semibold text-brand-graphite">{item.q}</p>
                    <p className="mt-2 text-sm leading-6 text-brand-slate">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ProductInquiryForm product={product} />
        </div>
      </section>
    </>
  );
}
