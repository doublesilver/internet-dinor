import type { Metadata } from "next";
import { ApplyInquiryForm } from "@/components/forms/ApplyInquiryForm";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "가입 신청",
  description: "인터넷/TV 가입 신청서를 작성하세요. 빠르게 상담 연결해드립니다."
};

export default async function ApplyPage() {
  return (
    <SiteShell>
      {(settings) => (
        <section className="bg-brand-surface py-8">
          <div className="container-page">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-black text-brand-graphite md:text-4xl">가입 신청서</h1>
              <p className="mt-2 text-brand-slate">아래 정보를 입력하시면 전문 상담사가 빠르게 연락드립니다.</p>
            </div>
            <div className="mx-auto max-w-3xl">
              <ApplyInquiryForm phoneLink={settings.phoneLink} />
            </div>
          </div>
        </section>
      )}
    </SiteShell>
  );
}
