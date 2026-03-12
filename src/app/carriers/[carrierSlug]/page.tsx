import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { DisclaimerSection } from "@/components/sections/DisclaimerSection";
import { Button } from "@/components/ui/Button";
import { getCarrierBySlug, getCarriers, getProductsByCarrierSlug, getSiteSettings } from "@/lib/repositories/content";
import { QuickInquiryForm } from "@/components/forms/QuickInquiryForm";

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

const bundleLabel: Record<string, string> = {
  internet_only: "인터넷 단독",
  internet_tv: "인터넷 + TV",
  business: "사업장용",
  custom: "기타"
};

export default async function CarrierDetailPage({ params }: { params: Promise<{ carrierSlug: string }> }) {
  const { carrierSlug } = await params;
  const [settings, carrier, products] = await Promise.all([
    getSiteSettings(),
    getCarrierBySlug(carrierSlug),
    getProductsByCarrierSlug(carrierSlug)
  ]);

  if (!carrier) notFound();

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

      {/* Products */}
      <section className="section-space">
        <div className="container-page">
          <SectionHeading
            title={`${carrier.shortName} 상품 목록`}
            description="상품을 비교하고 가장 적합한 구성을 선택하세요."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="surface-card flex flex-col">
                <div className="mb-3 flex flex-wrap gap-2">
                  {product.badgeTags.map((tag) => (
                    <span key={tag} className="rounded-lg bg-brand-lavender-soft px-3 py-1 text-xs font-semibold text-brand-graphite">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-bold text-brand-graphite">{product.name}</h3>
                <p className="mt-1 text-sm text-brand-slate">{product.summary}</p>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-brand-slate">구성</dt>
                    <dd className="font-semibold text-brand-graphite">{bundleLabel[product.bundleType] ?? "인터넷"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-brand-slate">속도</dt>
                    <dd className="font-semibold text-brand-graphite">{product.internetSpeed}</dd>
                  </div>
                </dl>

                <div className="mt-4 border-t border-brand-border pt-4">
                  <p className="price-discount">월 {product.monthlyPriceLabel}</p>
                  <p className="mt-1 text-xs text-brand-slate">3년 약정 기준</p>
                </div>

                {product.benefitLabel && (
                  <p className="mt-3 rounded-xl bg-brand-orange/5 px-4 py-2.5 text-sm font-semibold text-brand-orange">
                    {product.benefitLabel}
                  </p>
                )}

                <div className="mt-auto flex gap-2 pt-4">
                  <Button href={`/products/${product.slug}`} fullWidth>
                    상세 보기
                  </Button>
                  <Button href="/apply" variant="secondary" fullWidth>
                    빠른 견적
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="pb-8">
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
