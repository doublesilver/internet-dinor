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

  // Build representative product per carrier from featured products
  const carrierProducts = carriers.map((carrier) => {
    const product = products.find((p) => p.carrierId === carrier.id);
    return { carrier, product };
  }).filter((item) => item.product);

  return (
    <SiteShell settings={settings}>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-orange/5 via-white to-white">
        <div className="container-page grid gap-8 py-12 md:grid-cols-[1.2fr_0.8fr] md:py-20">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-bold text-brand-orange">
              이번 달 특별 혜택
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-brand-graphite md:text-6xl">
              놓치지 마세요!
              <br />
              <span className="text-brand-orange">최대 혜택</span> 지원
            </h1>
            <p className="text-lg leading-8 text-brand-slate">
              당일개통, 당일지급 — 전국 어디서나 최대 혜택으로 인터넷/TV를 신청하세요.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-brand-graphite px-4 py-2 text-sm font-semibold text-white">당일 개통</span>
              <span className="rounded-full bg-brand-graphite px-4 py-2 text-sm font-semibold text-white">당일 지급</span>
              <span className="rounded-full bg-brand-graphite px-4 py-2 text-sm font-semibold text-white">전국 설치</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/apply">신청서 작성</Button>
              <Button href={settings.phoneLink} variant="secondary">
                {settings.phoneLabel} 전화 상담
              </Button>
            </div>
          </div>
          <div>
            <div className="rounded-2xl bg-white p-1 shadow-soft">
              <div className="rounded-xl bg-brand-surface p-4">
                <h2 className="mb-4 text-center text-lg font-bold text-brand-graphite">
                  빠른 견적 받기
                </h2>
                <QuickInquiryForm sourcePage="/" submitLabel="최대 지원금 확인" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Representative Products Section */}
      <section className="section-space">
        <div className="container-page">
          <SectionHeading
            title="대표 상품을 비교해보세요"
            description="통신사별 인기 상품을 한눈에 비교하고 최적의 조합을 찾아보세요."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {carrierProducts.map(({ carrier, product }) => (
              <CarrierProductCard
                key={carrier.id}
                carrierName={carrier.shortName}
                carrierSlug={carrier.slug}
                productName={product!.name}
                speed={product!.internetSpeed}
                channelCount={product!.tvIncluded ? "200+" : undefined}
                discountPrice={product!.monthlyPriceLabel}
                giftAmount={product!.benefitLabel}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Service Category Section */}
      <section className="section-space bg-brand-surface">
        <div className="container-page">
          <SectionHeading
            title="어떤 구성을 원하시나요?"
            description="원하는 서비스 조합을 선택하면 맞춤 상품을 안내해드립니다."
          />
          <ServiceCategoryCards />
        </div>
      </section>

      {/* Real-time Application Status */}
      <section className="section-space">
        <div className="container-page">
          <SectionHeading
            title="실시간 신청 현황"
            description="지금도 많은 분들이 인터넷공룡을 통해 신청하고 계십니다."
          />
          <RecentApplications />
        </div>
      </section>

      {/* Tips Gallery */}
      {guides.length > 0 && (
        <section className="section-space bg-brand-surface">
          <div className="container-page">
            <SectionHeading
              title="꿀TIP 모아보기"
              description="인터넷 가입 전 꼭 알아야 할 정보를 정리했습니다."
              action={<Button href="/board/guide" variant="secondary">전체 보기</Button>}
            />
            <TipGallery tips={guides} />
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="section-space">
        <div className="container-page">
          <div className="grid gap-8 rounded-[32px] bg-brand-graphite px-6 py-10 text-white md:grid-cols-[1fr_400px] md:px-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                30초면 충분합니다
              </h2>
              <p className="text-sm leading-7 text-white/80 md:text-base">
                이름과 연락처만 남겨주시면 전문 상담사가 맞춤 비교 견적을 안내해드립니다.
              </p>
              <a href={settings.phoneLink} className="inline-flex items-center gap-2 text-2xl font-black text-brand-orange">
                {settings.phoneLabel}
              </a>
            </div>
            <QuickInquiryForm sourcePage="/#bottom-cta" submitLabel="빠른 상담 요청" />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
