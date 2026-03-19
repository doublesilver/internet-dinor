import type { Metadata } from "next";
import { fetchOneEntry } from "@builder.io/sdk-react";
import Link from "next/link";
import { BuilderEditableSection } from "@/components/builder/BuilderEditableSection";
import { QuickInquiryForm } from "@/components/forms/QuickInquiryForm";
import { CarrierProductCard } from "@/components/sections/CarrierProductCard";
import { RecentApplications } from "@/components/sections/RecentApplications";
import { ServiceCategoryCards } from "@/components/sections/ServiceCategoryCard";
import { TipGallery } from "@/components/sections/TipGallery";
import { Button } from "@/components/ui/Button";
import { getBoardCategoryHref } from "@/lib/constants/board";
import { BUILDER_API_KEY, BUILDER_MODEL, isBuilderEnabled } from "@/lib/builder";
import { getFeaturedPosts, getProductsByCarrierSlug, getSiteSettings } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "인터넷공룡 - 인터넷/TV 가입 비교 최대 사은품",
  description: "전국 최대 사은품! 인터넷/TV 가입 비교하고 당일설치, 당일입금 받으세요."
};

const CARRIER_SLUGS = ["sk", "kt", "lg", "skylife", "hellovision"] as const;

export default async function HomePage() {
  const builderEnabled = isBuilderEnabled();

  const [guides, settings, ...carrierProducts] = await Promise.all([
    getFeaturedPosts("guide"),
    getSiteSettings(),
    ...CARRIER_SLUGS.map((slug) => getProductsByCarrierSlug(slug))
  ]);

  let builderTopContent = null;
  let builderBottomContent = null;
  if (builderEnabled) {
    try {
      [builderTopContent, builderBottomContent] = await Promise.all([
        fetchOneEntry({ model: BUILDER_MODEL, apiKey: BUILDER_API_KEY, userAttributes: { urlPath: "/home-top" } }),
        fetchOneEntry({ model: BUILDER_MODEL, apiKey: BUILDER_API_KEY, userAttributes: { urlPath: "/home-bottom" } })
      ]);
    } catch {
      // Builder.io unavailable — continue without editable sections
    }
  }

  return (
    <>
      {/* Builder.io: 홈 상단 편집 가능 영역 (이미지/배너 배치 가능) */}
      <BuilderEditableSection content={builderTopContent} />

      <section className="relative overflow-hidden" style={{ backgroundColor: "var(--design-hero-bg, #4A86CF)" }}>
        <div className="container-page flex flex-col gap-5 py-8 md:flex-row md:items-start md:justify-between md:py-14">
          <div className="space-y-4 md:flex-1">
            <h1
              className="font-black font-surround leading-[1.3]"
              style={{
                fontSize: "var(--design-hero-title-font-size, clamp(28px, 4vw, 55px))",
                color: "var(--design-hero-title-color, #ffffff)"
              }}
            >
              {settings.heroTitle}
              <br />
              최대{" "}
              <span
                className="relative inline-block text-brand-orange"
                style={{ textShadow: "3px 3px 0 #FFEF0A, -1px -1px 0 #FFEF0A, 1px -1px 0 #FFEF0A, -1px 1px 0 #FFEF0A, 1px 1px 0 #FFEF0A" }}
              >
                {settings.heroAmount}
              </span>
              <br />
              {settings.heroSubtitle}
            </h1>
            <div className="space-y-2">
              <p
                className="text-lg leading-relaxed"
                style={{ color: "var(--design-hero-subtitle-color, rgba(255,255,255,0.85))", fontSize: "var(--design-hero-subtitle-font-size, 18px)" }}
              >
                전국 최대 사은품 지급하는 곳!
                <br />
                비밀지원금은 <span className="font-bold">빠른견적</span>을 통해 문의해주세요.
              </p>
              <p className="text-xs opacity-70" style={{ color: "var(--design-hero-subtitle-color, rgba(255,255,255,0.85))" }}>※ 지원금은 통신사 및 상품에 따라 상이합니다 ※</p>
            </div>
          </div>
          <div className="md:w-[min(40%,420px)] md:shrink-0">
            <div className="rounded-[25px] bg-white p-6 shadow-lg md:p-8">
              <h3 className="mb-5 text-center text-2xl font-bold text-brand-orange">빠른 견적 문의</h3>
              <QuickInquiryForm sourcePage="/" submitLabel={settings.heroCtaLabel} />
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-10 md:py-14"
        style={{
          backgroundColor: "var(--design-carrier-bg, #D6E4F5)"
        }}
      >
        <div className="container-page">
          <div className="mb-6">
            <h2
              className="font-black"
              style={{
                fontSize: "var(--design-carrier-heading-font-size, clamp(24px, 3vw, 32px))",
                color: "var(--design-carrier-heading-color, #4A86CF)"
              }}
            >각 통신사 대표 상품</h2>
            <p className="mt-2 text-sm text-gray-500">※3년약정, 휴대폰 1회선 결합 할인 기준, VAT포함가</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {CARRIER_SLUGS.map((slug, index) => {
              const product = carrierProducts[index]?.[0];
              if (!product) return null;
              return (
                <CarrierProductCard
                  key={slug}
                  carrierSlug={slug}
                  productName={product.name}
                  speed={product.internetSpeed}
                  originalPrice={product.originalPriceLabel}
                  discountPrice={product.monthlyPriceLabel}
                  giftAmount={product.benefitLabel || undefined}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14" style={{ backgroundColor: "var(--design-benefits-bg, #6EA8E0)" }}>
        <div className="container-page">
          <div className="mb-6">
            <h2
              className="font-black font-surround"
              style={{
                fontSize: "var(--design-benefits-heading-font-size, clamp(24px, 3vw, 32px))",
                color: "var(--design-benefits-heading-color, #ffffff)"
              }}
            >혜택 구성별 최대 사은품</h2>
          </div>
          <ServiceCategoryCards />
        </div>
      </section>

      <section className="py-8 md:py-12" style={{ backgroundColor: "var(--design-cta-bg, #333333)" }}>
        <div className="container-page space-y-4 text-center">
          <p className="text-lg font-medium" style={{ color: "var(--design-cta-heading-color, #ffffff)" }}>너 빼고 다 신청 중..</p>
          <h2
            className="font-black font-surround"
            style={{
              fontSize: "var(--design-cta-heading-font-size, clamp(24px, 3vw, 32px))",
              color: "var(--design-cta-heading-color, #ffffff)"
            }}
          >혜택이 이렇게나 많았다고?</h2>
          <p className="text-base opacity-90" style={{ color: "var(--design-cta-heading-color, #ffffff)" }}>약정끝난 인터넷 변경하고 몰랐던 비밀지원금 왕창 받아 가자!</p>
          <p className="text-sm opacity-70" style={{ color: "var(--design-cta-heading-color, #ffffff)" }}>현금 주는 건 비밀~!</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/apply"
              className="bg-white px-8 py-3 font-bold text-brand-orange hover:bg-gray-100"
              style={{
                borderRadius: "var(--design-button-radius, 9999px)",
                fontSize: "var(--design-button-font-size, 14px)"
              }}
            >
              신청서 작성
            </Link>
            <a
              href={settings.phoneLink}
              className="border-2 border-white px-8 py-3 font-bold text-white hover:bg-white/10"
              style={{
                borderRadius: "var(--design-button-radius, 9999px)",
                fontSize: "var(--design-button-font-size, 14px)"
              }}
            >
              전화 상담
            </a>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container-page">
          <div className="mb-6 text-center">
            <h2
              className="font-black font-surround"
              style={{
                fontSize: "var(--design-recent-heading-font-size, clamp(24px, 3vw, 32px))",
                color: "var(--design-recent-heading-color, #2C3E50)"
              }}
            >신청 현황</h2>
            <p className="mt-3 text-brand-slate">인터넷공룡을 통해 이렇게 신청하실 수 있습니다.</p>
          </div>
          <RecentApplications />
        </div>
      </section>

      {guides.length > 0 && (
        <section className="py-10 md:py-14" style={{ backgroundColor: "var(--design-tips-bg, #F5F8FC)" }}>
          <div className="container-page">
            <div className="mb-6 flex items-end justify-between">
              <h2
                className="font-black font-surround"
                style={{
                  fontSize: "var(--design-tips-heading-font-size, clamp(24px, 3vw, 32px))",
                  color: "var(--design-tips-heading-color, #2C3E50)"
                }}
              >꿀TIP 모아보기</h2>
              <Button href={getBoardCategoryHref("guide") ?? "/board/guide"} variant="secondary">
                전체 보기
              </Button>
            </div>
            <TipGallery tips={guides} />
          </div>
        </section>
      )}

      {/* Builder.io: 홈 하단 편집 가능 영역 (이미지/배너 배치 가능) */}
      <BuilderEditableSection content={builderBottomContent} />
    </>
  );
}
