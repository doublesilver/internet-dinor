import { SiteShell } from "@/components/layout/SiteShell";
import { getSiteSettings } from "@/lib/repositories/content";

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <SiteShell settings={settings}>
      <section className="section-space">
        <div className="container-page max-w-4xl">
          <article className="surface-card space-y-6">
            <h1 className="text-4xl font-black tracking-tight text-brand-graphite">개인정보처리방침</h1>
            <p className="text-base leading-7 text-brand-slate">
              인터넷공룡은 상담 접수에 필요한 최소한의 개인정보만 수집하며, 수집 목적과 보관 기준은 실제 운영 전 확정 문안으로 교체됩니다.
            </p>
            <div className="space-y-4 text-sm leading-7 text-brand-slate">
              <p>수집 항목: 이름, 연락처, 설치 지역, 상담 메모</p>
              <p>수집 목적: 인터넷/TV/통신 상담 접수 및 응대</p>
              <p>보관 기간: 실제 운영 정책 확정 후 반영</p>
            </div>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
