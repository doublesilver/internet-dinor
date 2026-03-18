import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BundleDiscountTable } from "@/components/sections/BundleDiscountTable";
import { DisclaimerSection } from "@/components/sections/DisclaimerSection";
import { PriceCalculator } from "@/components/sections/PriceCalculator";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getCarrierTheme } from "@/lib/constants/carriers";
import { getCarrierBySlug, getCarriers, getProductsByCarrierSlug, getSiteSettings } from "@/lib/repositories/content";
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

export default async function CarrierDetailPage({ params }: { params: Promise<{ carrierSlug: string }> }) {
  const { carrierSlug } = await params;
  const [carrier, products, settings] = await Promise.all([
    getCarrierBySlug(carrierSlug),
    getProductsByCarrierSlug(carrierSlug),
    getSiteSettings()
  ]);

  if (!carrier) notFound();

  const theme = getCarrierTheme(carrier.slug);
  const featuredProducts = products.slice(0, 3);

  const heroGradientStyle = {
    background: `linear-gradient(to bottom, ${theme.accentColor}18, #ffffff)`
  };

  return (
    <>
      <section className="py-8 md:py-12" style={heroGradientStyle}>
        <div className="container-page space-y-4">
          <p className="text-sm font-medium text-brand-slate">
            홈 &gt; 통신사별 상품 &gt; <span style={{ color: theme.accentColor }}>{carrier.shortName}</span>
          </p>
          <h1 className="text-3xl font-black tracking-tight text-brand-graphite md:text-5xl">{carrier.heroTitle}</h1>
          <p className="max-w-3xl text-base leading-7 text-brand-slate md:text-lg">{carrier.heroDescription}</p>
          <div className="flex flex-wrap gap-3">
            {carrier.featurePoints.map((point) => (
              <span key={point} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-graphite shadow-sm">
                {point}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/apply"
              className="inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-bold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: theme.accentColor }}
            >
              신청서 작성
            </a>
            <a
              href={settings.phoneLink}
              className="inline-flex items-center justify-center rounded-2xl border px-6 py-3.5 text-sm font-bold bg-white transition-colors hover:bg-blue-50"
              style={{ borderColor: theme.accentColor, color: theme.accentColor }}
            >
              전화 상담
            </a>
          </div>
        </div>
      </section>

      <section className="bg-brand-surface py-8 md:py-12">
        <div className="container-page">
          <h2 className="mb-2 text-center text-2xl font-black text-brand-graphite md:text-3xl">
            <span style={{ color: theme.accentColor }}>{carrier.shortName}</span>의
          </h2>
          <p className="mb-5 text-center text-2xl font-black text-brand-graphite md:text-3xl">
            <strong>등록된 공개 상품</strong> 기준으로 혜택과 요금을 비교해보세요!
          </p>
          <PriceCalculator carrierSlug={carrier.slug} carrierName={carrier.shortName} products={products} priceData={carrier.priceData} />
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="section-space">
          <div className="container-page">
            <SectionHeading title={`${carrier.shortName} 추천 상품`} description="가장 인기 있는 상품을 비교하고 최적의 구성을 선택하세요." />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col overflow-hidden rounded-[20px] border border-brand-border bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="px-6 pb-4 pt-6">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {product.badgeTags.map((tag) => (
                        <span key={tag} className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: theme.accentColor }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-black leading-snug text-brand-graphite">{product.name}</h3>
                    <p className="mt-1 text-sm text-brand-slate">{product.summary}</p>
                  </div>

                  <div className="flex gap-3 px-6 pb-4">
                    <span className="rounded-lg bg-brand-surface px-3 py-1.5 text-xs font-semibold text-brand-graphite">{product.internetSpeed}</span>
                    <span className="rounded-lg bg-brand-surface px-3 py-1.5 text-xs font-semibold text-brand-graphite">
                      {getBundleTypeLabel(product.bundleType)}
                    </span>
                  </div>

                  <div className="border-t border-brand-border px-6 py-4">
                    {product.originalPriceLabel && (
                      <p className="mb-1 text-sm text-brand-slate line-through">월 {product.originalPriceLabel}</p>
                    )}
                    <p className="text-sm text-brand-slate">
                      월{" "}
                      <strong className="text-2xl font-black" style={{ color: theme.accentColor }}>
                        {product.monthlyPriceLabel}
                      </strong>
                    </p>
                    <p className="mt-0.5 text-xs text-brand-slate">3년 약정 기준</p>
                  </div>

                  <div className="mt-auto flex border-t border-brand-border">
                    <a
                      href="/apply"
                      className="flex-1 py-3.5 text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      빠른 견적
                    </a>
                    <a
                      href="/apply"
                      className="flex-1 border-l border-white/20 py-3.5 text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: theme.accentColor, opacity: 0.85 }}
                    >
                      신청서 작성
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {products.length > 3 && (
              <div className="mt-8 text-center">
                <p className="mb-4 text-sm text-brand-slate">외 {products.length - 3}개 상품 더 보기</p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.slice(3).map((product) => (
                    <article key={product.id} className="flex items-center justify-between rounded-2xl border border-brand-border bg-white px-5 py-4 shadow-sm">
                      <div>
                        <p className="text-sm font-bold text-brand-graphite">{product.name}</p>
                        <p className="mt-0.5 text-xs text-brand-slate">
                          {product.internetSpeed} · {getBundleTypeLabel(product.bundleType)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black" style={{ color: theme.accentColor }}>
                          월 {product.monthlyPriceLabel}
                        </p>
                        <Button href="/apply" variant="ghost" className="mt-2 !px-3 !py-1.5 !text-xs">
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

      <BundleDiscountTable carrierSlug={carrier.slug} />

      <section className="pb-8 pt-4">
        <div className="container-page">
          <DisclaimerSection />
        </div>
      </section>

    </>
  );
}
