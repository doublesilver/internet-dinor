import { QuickInquiryForm } from "@/components/forms/QuickInquiryForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { CarrierProductCard } from "@/components/sections/CarrierProductCard";
import { RecentApplications } from "@/components/sections/RecentApplications";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ServiceCategoryCards } from "@/components/sections/ServiceCategoryCard";
import { TipGallery } from "@/components/sections/TipGallery";
import { Button } from "@/components/ui/Button";
import { getCarriers, getFeaturedPosts, getFeaturedProducts, getSiteSettings } from "@/lib/repositories/content";

export default async function HomePage() {
  const [settings, carriers, products, guides] = await Promise.all([
    getSiteSettings(),
    getCarriers(),
    getFeaturedProducts(),
    getFeaturedPosts("guide")
  ]);

  const carrierProducts = carriers.map((carrier) => {
    const product = products.find((p) => p.carrierId === carrier.id);
    return { carrier, product };
  }).filter((item) => item.product);

  return (
    <SiteShell settings={settings}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-graphite via-gray-900 to-brand-graphite">
        <div className="container-page grid gap-8 py-14 md:grid-cols-[1.2fr_0.8fr] md:py-24">
          <div className="space-y-5 text-white">
            <span className="inline-block rounded-full bg-brand-orange px-4 py-1.5 text-sm font-bold text-white">
              이번 달 특별 혜택
            </span>
            <h1 className="text-4xl font-black leading-[1.15] tracking-tight md:text-[56px]">
              놓치지 마세요!
              <br />
              <span className="text-brand-orange">최대 혜택</span> 지원
            </h1>
            <p className="text-base leading-relaxed text-white/70 md:text-lg">
              당일개통 · 당일지급 — 전국 어디서나 최대 사은품으로 인터넷/TV를 시작하세요.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">당일 개통</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">당일 지급</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">전국 설치</span>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button href="/apply">신청서 작성</Button>
              <a href={settings.phoneLink} className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                📞 {settings.phoneLabel}
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-full rounded-2xl bg-white p-5 shadow-soft">
              <h2 className="mb-3 text-center text-lg font-bold text-brand-graphite">빠른 견적 받기</h2>
              <QuickInquiryForm sourcePage="/" submitLabel={settings.heroCtaLabel} />
            </div>
          </div>
        </div>
      </section>

      {/* Representative Products */}
      <section className="py-14 md:py-20">
        <div className="container-page">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black text-brand-graphite md:text-3xl">대표 상품을 비교해보세요</h2>
            <p className="mt-2 text-brand-slate">통신사별 인기 상품을 한눈에 비교하고 최적의 조합을 찾아보세요.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {carrierProducts.map(({ carrier, product }) => (
              <CarrierProductCard
                key={carrier.id}
                carrierName={carrier.shortName}
                carrierSlug={carrier.slug}
                productName={product!.name}
                speed={product!.internetSpeed}
                channelCount={product!.tvIncluded ? "TV 포함" : undefined}
                discountPrice={product!.monthlyPriceLabel}
                giftAmount={product!.benefitLabel}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="bg-brand-surface py-14 md:py-20">
        <div className="container-page">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black text-brand-graphite md:text-3xl">어떤 구성을 원하시나요?</h2>
            <p className="mt-2 text-brand-slate">원하는 서비스 조합을 선택하면 맞춤 상품을 안내해드립니다.</p>
          </div>
          <ServiceCategoryCards />
        </div>
      </section>

      {/* Real-time Status */}
      <section className="py-14 md:py-20">
        <div className="container-page">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black text-brand-graphite md:text-3xl">실시간 신청 현황</h2>
            <p className="mt-2 text-brand-slate">지금도 많은 분들이 인터넷공룡을 통해 신청하고 계십니다.</p>
          </div>
          <RecentApplications />
        </div>
      </section>

      {/* Tips */}
      {guides.length > 0 && (
        <section className="bg-brand-surface py-14 md:py-20">
          <div className="container-page">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-black text-brand-graphite md:text-3xl">꿀TIP 모아보기</h2>
                <p className="mt-2 text-brand-slate">인터넷 가입 전 꼭 알아야 할 정보를 정리했습니다.</p>
              </div>
              <Button href="/board/guide" variant="secondary">전체 보기</Button>
            </div>
            <TipGallery tips={guides} />
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-14 md:py-20">
        <div className="container-page">
          <div className="grid gap-8 overflow-hidden rounded-3xl bg-brand-graphite p-8 text-white md:grid-cols-[1fr_380px] md:p-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">30초면 충분합니다</h2>
              <p className="leading-relaxed text-white/70">이름과 연락처만 남겨주시면 전문 상담사가 맞춤 비교 견적을 안내해드립니다.</p>
              <a href={settings.phoneLink} className="inline-flex items-center gap-2 text-3xl font-black text-brand-orange">
                📞 {settings.phoneLabel}
              </a>
            </div>
            <QuickInquiryForm sourcePage="/#bottom-cta" submitLabel="빠른 상담 요청" />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
