import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { getSiteSettings } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "문의 접수 완료",
  robots: { index: false, follow: false }
};

export default async function InquiryCompletePage() {
  const settings = await getSiteSettings();

  return (
    <section className="section-space">
      <div className="container-page max-w-3xl">
        <div className="surface-card text-center">
          <p className="text-sm font-semibold text-brand-orange">Complete</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-brand-graphite">문의가 접수되었습니다</h1>
          <p className="mt-4 text-base leading-7 text-brand-slate">
            영업시간 기준으로 순차 연락드리며, 빠른 상담이 필요하면 바로 전화 상담으로도 연결할 수 있습니다.
          </p>
          <div className="mt-8 flex flex-col gap-3 md:flex-row md:justify-center">
            <Button href={settings.phoneLink}>전화 바로 연결</Button>
            <Button href="/" variant="secondary">
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
