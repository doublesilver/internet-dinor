import type { Metadata } from "next";
import Link from "next/link";
import { QuickInquiryForm } from "@/components/forms/QuickInquiryForm";
import { CarrierProductCard } from "@/components/sections/CarrierProductCard";
import { RecentApplications } from "@/components/sections/RecentApplications";
import { ServiceCategoryCards } from "@/components/sections/ServiceCategoryCard";
import { TipGallery } from "@/components/sections/TipGallery";
import { Button } from "@/components/ui/Button";
import { getBoardCategoryHref } from "@/lib/constants/board";
import { getFeaturedPosts, getSiteSettings } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "인터넷공룡 - 인터넷/TV 가입 비교 최대 사은품",
  description: "전국 최대 사은품! 인터넷/TV 가입 비교하고 당일설치, 당일입금 받으세요."
};

export default async function HomePage() {
  const [guides, settings] = await Promise.all([getFeaturedPosts("guide"), getSiteSettings()]);

  return (
    <>
      <section className="relative overflow-hidden bg-brand-orange">
        <div className="container-page flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between md:py-20">
          <div className="space-y-6 text-white md:w-[55%]">
            <h1 className="text-4xl font-black font-surround leading-[1.3] md:text-[55px]">
              이번달 남김없이!
              <br />
              최대{" "}
              <span
                className="relative inline-block text-brand-orange"
                style={{ textShadow: "3px 3px 0 #FFEF0A, -1px -1px 0 #FFEF0A, 1px -1px 0 #FFEF0A, -1px 1px 0 #FFEF0A, 1px 1px 0 #FFEF0A" }}
              >
                220만원
              </span>
              <br />
              당일설치! 당일입금!
            </h1>
            <div className="space-y-2">
              <p className="text-lg leading-relaxed">
                전국 최대 사은품 지급하는 곳!
                <br />
                비밀지원금은 <span className="font-bold">빠른견적</span>을 통해 문의해주세요.
              </p>
              <p className="text-xs opacity-70">※ 지원금은 통신사 및 상품에 따라 상이합니다 ※</p>
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

      <section className="bg-brand-peach py-16 md:py-24">
        <div className="container-page">
          <div className="mb-10">
            <h2 className="text-3xl font-black font-surround text-brand-orange md:text-4xl">각 통신사 대표 상품</h2>
            <p className="mt-2 text-sm text-gray-500">※3년약정, 휴대폰 1회선 결합 할인 기준, VAT포함가</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <CarrierProductCard
              carrierSlug="sk"
              productName="기가라이트인터넷 500M + B tv ALL"
              speed="500M"
              channelCount="tv 257개 채널"
              originalPrice="49,500원"
              discountPrice="39,400원"
              giftAmount="사은품 47만원"
            />
            <CarrierProductCard
              carrierSlug="kt"
              productName="인터넷베이직 500M + TV베이직"
              speed="500M"
              channelCount="tv 233개 채널"
              originalPrice="45,100원"
              discountPrice="39,600원"
              giftAmount="사은품 45만원"
            />
            <CarrierProductCard
              carrierSlug="lg"
              productName="와이파이기본 500M + TV베이직"
              speed="500M"
              channelCount="tv 211개 채널"
              originalPrice="44,000원"
              discountPrice="34,100원"
              giftAmount="사은품 47만원"
            />
            <CarrierProductCard
              carrierSlug="skylife"
              productName="와이파이 100M + TV SKY ALL"
              speed="100M"
              channelCount="tv 238개 채널"
              discountPrice="30,800원"
              giftAmount="사은품 35만원"
            />
            <CarrierProductCard
              carrierSlug="hellovision"
              productName="광랜라이트 100M + TV 이코노미"
              speed="100M"
              channelCount="tv 109개 채널"
              discountPrice="29,530원"
              giftAmount="사은품 30만원"
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-sky py-16 md:py-24">
        <div className="container-page">
          <div className="mb-10">
            <h2 className="text-3xl font-black font-surround text-white md:text-4xl">혜택 구성별 최대 사은품</h2>
          </div>
          <ServiceCategoryCards />
        </div>
      </section>

      <section className="bg-brand-orange py-12 md:py-16">
        <div className="container-page space-y-4 text-center text-white">
          <p className="text-lg font-medium">너 빼고 다 신청 중..</p>
          <h2 className="text-3xl font-black font-surround md:text-4xl">혜택이 이렇게나 많았다고?</h2>
          <p className="text-base opacity-90">약정끝난 인터넷 변경하고 몰랐던 비밀지원금 왕창 받아 가자!</p>
          <p className="text-sm opacity-70">현금 주는 건 비밀~!</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/apply" className="rounded-full bg-white px-8 py-3 font-bold text-brand-orange hover:bg-gray-100">
              신청서 작성
            </Link>
            <a href={settings.phoneLink} className="rounded-full border-2 border-white px-8 py-3 font-bold text-white hover:bg-white/10">
              전화 상담
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black font-surround text-brand-graphite md:text-4xl">실시간 신청 현황</h2>
            <p className="mt-3 text-brand-slate">지금도 많은 분들이 인터넷공룡을 통해 신청하고 계십니다.</p>
          </div>
          <RecentApplications />
        </div>
      </section>

      {guides.length > 0 && (
        <section className="bg-brand-surface py-16 md:py-24">
          <div className="container-page">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-3xl font-black font-surround text-brand-graphite md:text-4xl">꿀TIP 모아보기</h2>
              <Button href={getBoardCategoryHref("guide") ?? "/board/guide"} variant="secondary">
                전체 보기
              </Button>
            </div>
            <TipGallery tips={guides} />
          </div>
        </section>
      )}

      <section className="bg-[#333] py-16 md:py-24">
        <div className="container-page text-center text-white">
          <p className="text-lg font-medium">지금 바로 전문 상담사에게 문의하세요</p>
          <a href={settings.phoneLink} className="mt-4 inline-block text-5xl font-black text-brand-orange md:text-6xl">
            {settings.phoneLabel}
          </a>
          <p className="mt-4 text-base text-white/70">평일 오전 10시 ~ 오후 7시 (주말/공휴일 휴무)</p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/apply" fullWidth>
              신청서 작성
            </Button>
            <Button href={settings.phoneLink} variant="secondary" fullWidth>
              전화 상담
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
