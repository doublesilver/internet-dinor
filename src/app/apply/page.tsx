import type { Metadata } from "next";
import { ApplyInquiryForm } from "@/components/forms/ApplyInquiryForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { getSiteSettings } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "상담 신청",
  description: "인터넷/TV 맞춤 상담을 신청하세요. 빠르게 비교 안내해드립니다."
};

export default async function ApplyPage() {
  const settings = await getSiteSettings();

  return (
    <SiteShell settings={settings}>
      <section className="section-space">
        <div className="container-page grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Apply"
              title="상담 신청서를 남기면 순서대로 연락드립니다"
              description="본인인증 없이 상담에 필요한 최소 정보만 먼저 받는 1차 MVP 구조입니다."
            />
            <div className="surface-card space-y-4">
              <div>
                <p className="text-sm font-semibold text-brand-orange">1. 기본 정보</p>
                <p className="mt-1 text-sm text-brand-slate">이름, 연락처, 설치 지역</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-orange">2. 희망 조건</p>
                <p className="mt-1 text-sm text-brand-slate">가입 유형, 구성, 속도, 관심 상품</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-orange">3. 남기실 말씀</p>
                <p className="mt-1 text-sm text-brand-slate">연락 희망 시간과 특이사항을 추가 입력</p>
              </div>
            </div>
          </div>
          <ApplyInquiryForm />
        </div>
      </section>
    </SiteShell>
  );
}
