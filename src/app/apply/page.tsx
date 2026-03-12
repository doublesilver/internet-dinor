import type { Metadata } from "next";
import { ApplyInquiryForm } from "@/components/forms/ApplyInquiryForm";
import { QuickInquiryForm } from "@/components/forms/QuickInquiryForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { getSiteSettings } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "가입 신청",
  description: "인터넷/TV 가입 신청서를 작성하세요. 빠르게 상담 연결해드립니다."
};

export default async function ApplyPage() {
  const settings = await getSiteSettings();

  return (
    <SiteShell settings={settings}>
      {/* Hero */}
      <section className="bg-brand-surface py-12 md:py-16">
        <div className="container-page">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-brand-graphite md:text-4xl">가입 신청서</h1>
            <p className="mt-2 text-brand-slate">아래 정보를 입력하시면 전문 상담사가 빠르게 연락드립니다.</p>
            <a
              href={settings.phoneLink}
              className="mt-6 inline-flex items-center gap-2 text-3xl font-black text-brand-orange md:text-4xl"
            >
              {settings.phoneLabel}
            </a>
          </div>
          <div className="mx-auto max-w-3xl">
            <ApplyInquiryForm />
          </div>
        </div>
      </section>

      {/* Quick Inquiry Bottom */}
      <section className="section-space bg-brand-graphite">
        <div className="container-page grid gap-8 text-white md:grid-cols-[1fr_400px]">
          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tight">빠른 상담 신청</h2>
            <p className="text-white/80">연락처만 남겨주시면 전문 상담사가 맞춤 견적을 안내해드립니다.</p>
            <a href={settings.phoneLink} className="inline-flex text-2xl font-black text-brand-orange">
              {settings.phoneLabel}
            </a>
          </div>
          <QuickInquiryForm sourcePage="/apply" submitLabel="빠른 상담 요청" />
        </div>
      </section>
    </SiteShell>
  );
}
