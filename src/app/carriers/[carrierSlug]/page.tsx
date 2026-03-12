import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { DisclaimerSection } from "@/components/sections/DisclaimerSection";
import { BundleDiscountTable } from "@/components/sections/BundleDiscountTable";
import { Button } from "@/components/ui/Button";
import { getCarrierBySlug, getCarriers, getProductsByCarrierSlug, getSiteSettings } from "@/lib/repositories/content";
import { QuickInquiryForm } from "@/components/forms/QuickInquiryForm";
import { PriceCalculator } from "@/components/sections/PriceCalculator";
import { getBundleTypeLabel } from "@/lib/utils/labels";

export async function generateStaticParams() {
  const carriers = await getCarriers();
  return carriers.map((carrier) => ({ carrierSlug: carrier.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ carrierSlug: string }> }): Promise<Metadata> {
  const { carrierSlug } = await params;
  const carrier = await getCarrierBySlug(carrierSlug);
  if (!carrier) return {};
  return {
    title: `${carrier.shortName} 인터넷/TV 상품`,
    description: carrier.heroDescription,
    openGraph: { title: `${carrier.shortName} 인터넷/TV 상품`, description: carrier.heroDescription }
  };
}

const carrierAccentColors: Record<string, string> = {
  sk: "#FFA13E",
  kt: "#FF5B62",
  lg: "#FE82B0",
  skylife: "#6DD5C0",
  hellovision: "#FFA38B"
};

export default async function CarrierDetailPage({ params }: { params: Promise<{ carrierSlug: string }> }) {
  const { carrierSlug } = await params;
  const [settings, carrier, products] = await Promise.all([
    getSiteSettings(),
    getCarrierBySlug(carrierSlug),
    getProductsByCarrierSlug(carrierSlug)
  ]);

  if (!carrier) notFound();

  const accentColor = carrierAccentColors[carrier.slug] ?? "#f15c2d";
  const featuredProducts = products.slice(0, 3);

  return (
    <SiteShell settings={settings}>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-sky-soft to-white py-12 md:py-20">
        <div className="container-page space-y-6">
          <p className="text-sm font-medium text-brand-slate">
            홈 &gt; 통신사별 상품 &gt; <span className="text-brand-orange">{carrier.shortName}</span>
          </p>
          <h1 className="text-3xl font-black tracking-tight text-brand-graphite md:text-5xl">
            {carrier.heroTitle}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-brand-slate md:text-lg">
            {carrier.heroDescription}
          </p>
          <div className="flex flex-wrap gap-3">
            {carrier.featurePoints.map((point) => (
              <span key={point} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-graphite shadow-sm">
                {point}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/apply">신청서 작성</Button>
            <Button href={settings.phoneLink} variant="secondary">전화 상담</Button>
          </div>
        </div>
      </section>

      {/* Price Calculator */}
      <section className="bg-brand-surface py-12 md:py-16">
        <div className="container-page">
          <h2 className="mb-2 text-center text-2xl font-black text-brand-graphite md:text-3xl">
            <span style={{ color: accentColor }}>{carrier.shortName}</span>의
          </h2>
          <p className="mb-8 text-center text-2xl font-black text-brand-graphite md:text-3xl">
            <strong>상품, 혜택, 요금</strong>을 직접 확인하고 비교해보세요!
          </p>
          <PriceCalculator
            carrierSlug={carrier.slug}
            carrierName={carrier.shortName}
            accentColor={accentColor}
          />
        </div>
      </section>

      {/* Featured Product Cards */}
      {featuredProducts.length > 0 && (
        <section className="section-space">
          <div className="container-page">
            <SectionHeading
              title={`${carrier.shortName} 추천 상품`}
              description="가장 인기 있는 상품을 비교하고 최적의 구성을 선택하세요."
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col overflow-hidden rounded-[20px] border border-brand-border bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Card header */}
                  <div className="px-6 pt-6 pb-4">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {product.badgeTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full px-3 py-1 text-xs font-bold text-white"
                          style={{ backgroundColor: accentColor }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-black text-brand-graphite leading-snug">{product.name}</h3>
                    <p className="mt-1 text-sm text-brand-slate">{product.summary}</p>
                  </div>

                  {/* Specs row */}
                  <div className="flex gap-3 px-6 pb-4">
                    <span className="rounded-lg bg-brand-surface px-3 py-1.5 text-xs font-semibold text-brand-graphite">
                      {product.internetSpeed}
                    </span>
                    <span className="rounded-lg bg-brand-surface px-3 py-1.5 text-xs font-semibold text-brand-graphite">
                      {getBundleTypeLabel(product.bundleType)}
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-brand-border px-6 py-4">
                    {product.originalPriceLabel && (
                      <p className="mb-1 text-sm text-brand-slate line-through">
                        월 {product.originalPriceLabel}
                      </p>
                    )}
                    <p className="text-sm text-brand-slate">
                      월{" "}
                      <strong
                        className="text-2xl font-black"
                        style={{ color: accentColor }}
                      >
                        {product.monthlyPriceLabel}
                      </strong>
                    </p>
                    <p className="mt-0.5 text-xs text-brand-slate">3년 약정 기준</p>
                  </div>

                  {/* CTA buttons */}
                  <div className="mt-auto flex border-t border-brand-border">
                    <a
                      href="/apply"
                      className="flex-1 py-3.5 text-center text-sm font-bold text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: accentColor }}
                    >
                      빠른 견적
                    </a>
                    <a
                      href="/apply"
                      className="flex-1 border-l border-white/20 py-3.5 text-center text-sm font-bold text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: accentColor, opacity: 0.85 }}
                    >
                      신청서 작성
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* Show all products if more than 3 */}
            {products.length > 3 && (
              <div className="mt-8 text-center">
                <p className="mb-4 text-sm text-brand-slate">외 {products.length - 3}개 상품 더 보기</p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.slice(3).map((product) => (
                    <article
                      key={product.id}
                      className="flex items-center justify-between rounded-2xl border border-brand-border bg-white px-5 py-4 shadow-sm"
                    >
                      <div>
                        <p className="text-sm font-bold text-brand-graphite">{product.name}</p>
                        <p className="mt-0.5 text-xs text-brand-slate">{product.internetSpeed} · {getBundleTypeLabel(product.bundleType)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black" style={{ color: accentColor }}>
                          월 {product.monthlyPriceLabel}
                        </p>
                        <Button href="/apply" variant="ghost" className="mt-2 !py-1.5 !px-3 !text-xs">
                          견적 보기
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Bundle Discount Table */}
      <BundleDiscountTable carrierSlug={carrier.slug} accentColor={accentColor} />

      {/* Disclaimer / Terms */}
      <section className="pb-8 pt-4">
        <div className="container-page">
          <DisclaimerSection />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-space bg-brand-graphite">
        <div className="container-page grid gap-8 text-white md:grid-cols-[1fr_400px]">
          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tight">{carrier.shortName} 상담 받기</h2>
            <p className="text-white/80">연락처만 남겨주시면 {carrier.shortName} 전문 상담사가 맞춤 견적을 안내해드립니다.</p>
            <a href={settings.phoneLink} className="inline-flex text-2xl font-black text-brand-orange">
              {settings.phoneLabel}
            </a>
          </div>
          <QuickInquiryForm sourcePage={`/carriers/${carrier.slug}`} submitLabel="빠른 상담 요청" />
        </div>
      </section>
    </SiteShell>
  );
}
