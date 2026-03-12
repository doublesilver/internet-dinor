import Image from "next/image";
import { QuickInquiryForm } from "@/components/forms/QuickInquiryForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { CarrierProductCard } from "@/components/sections/CarrierProductCard";
import { RecentApplications } from "@/components/sections/RecentApplications";
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
      {/* Hero - reference: #f15c2d bg, white text, 5.5rem heading */}
      <section className="relative bg-brand-orange overflow-hidden">
        <div className="container-page flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between md:py-20">
          <div className="space-y-6 text-white md:w-[55%]">
            <h1 className="text-4xl font-black leading-[1.3] md:text-[55px]">
              이번달 남김없이!<br />
              최대 <span className="relative inline-block text-brand-orange" style={{ textShadow: "3px 3px 0 #FFEF0A, -1px -1px 0 #FFEF0A, 1px -1px 0 #FFEF0A, -1px 1px 0 #FFEF0A, 1px 1px 0 #FFEF0A" }}>220만원</span>
              <br />당일설치! 당일입금!
            </h1>
            <div className="space-y-2">
              <p className="text-lg leading-relaxed">
                전국 최대 사은품 지급하는 곳!<br />
                비밀지원금은 <span className="font-bold">빠른견적</span>을 통해 문의해주세요.
              </p>
              <p className="text-xs opacity-70">
                ※ 지원금은 통신사 및 상품에 따라 상이합니다 ※
              </p>
            </div>
          </div>
          <div className="md:w-[40%]">
            <div className="rounded-[25px] bg-white p-6 shadow-lg md:p-8">
              <h3 className="mb-5 text-center text-2xl font-bold text-brand-orange">빠른 견적 문의</h3>
              <QuickInquiryForm sourcePage="/" submitLabel={settings.heroCtaLabel} />
            </div>
          </div>
        </div>
      </section>

      {/* Product Section - reference: #FFE9E2 bg */}
      <section className="bg-brand-peach py-16 md:py-24">
        <div className="container-page">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-brand-orange md:text-4xl">각 통신사 대표 상품</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {carrierProducts.map(({ carrier, product }) => (
              <CarrierProductCard
                key={carrier.id}
                carrierName={carrier.shortName}
                carrierSlug={carrier.slug}
                carrierLogo={`/images/carriers/${carrier.slug === "skylife" ? "kt_logo_sky" : carrier.slug === "hellovision" ? "lg_vision" : carrier.slug === "sk" ? "sk_logo" : carrier.slug === "kt" ? "kt_logo" : "lg_logo"}.png`}
                productName={product!.name}
                speed={product!.internetSpeed}
                channelCount={product!.tvIncluded ? "TV 포함" : undefined}
                originalPrice={product!.bundleType === "internet_tv" && parseInt(product!.monthlyPriceLabel.replace(/[^0-9]/g, "")) > 30000 ? `${parseInt(product!.monthlyPriceLabel.replace(/[^0-9]/g, "")) + 5000}원` : undefined}
                discountPrice={product!.monthlyPriceLabel}
                giftAmount={product!.benefitLabel}
                accentColor={carrier.slug === "sk" ? "#FFA13E" : carrier.slug === "kt" ? "#FF5B62" : carrier.slug === "lg" ? "#FE82B0" : carrier.slug === "skylife" ? "#6DD5C0" : "#FFA38B"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category Section - reference: #2DC2F1 bg */}
      <section className="bg-brand-sky py-16 md:py-24">
        <div className="container-page">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-white md:text-4xl">어떤 구성을 원하시나요?</h2>
          </div>
          <ServiceCategoryCards />
        </div>
      </section>

      {/* Real-time Status */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-brand-graphite md:text-4xl">실시간 신청 현황</h2>
            <p className="mt-3 text-brand-slate">지금도 많은 분들이 인터넷공룡을 통해 신청하고 계십니다.</p>
          </div>
          <RecentApplications />
        </div>
      </section>

      {/* Tips */}
      {guides.length > 0 && (
        <section className="bg-brand-surface py-16 md:py-24">
          <div className="container-page">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-3xl font-black text-brand-graphite md:text-4xl">꿀TIP 모아보기</h2>
              <Button href="/board/guide" variant="secondary">전체 보기</Button>
            </div>
            <TipGallery tips={guides} />
          </div>
        </section>
      )}

      {/* Bottom CTA - phone only, no duplicate form */}
      <section className="bg-[#333] py-16 md:py-24">
        <div className="container-page text-center text-white">
          <p className="text-lg font-medium">지금 바로 전문 상담사에게 문의하세요</p>
          <a href={settings.phoneLink} className="mt-4 inline-block text-5xl font-black text-brand-orange md:text-6xl">
            {settings.phoneLabel}
          </a>
          <p className="mt-4 text-base text-white/70">평일 오전 10시 ~ 오후 7시 (주말/공휴일 휴무)</p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/apply" fullWidth>신청서 작성</Button>
            <Button href={settings.phoneLink} variant="secondary" fullWidth>전화 상담</Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
