import { SiteShell } from "@/components/layout/SiteShell";
import { getSiteSettings } from "@/lib/repositories/content";

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <SiteShell settings={settings}>
      <section className="section-space">
        <div className="container-page max-w-4xl">
          <article className="surface-card space-y-6">
            <h1 className="text-4xl font-black tracking-tight text-brand-graphite">이용약관</h1>
            <p className="text-base leading-7 text-brand-slate">
              본 약관은 인터넷공룡 홈페이지의 이용 조건과 상담 접수 흐름에 대한 기본 규정을 설명하는 임시 뼈대 문안입니다.
            </p>
            <div className="space-y-4 text-sm leading-7 text-brand-slate">
              <p>본 사이트는 상담 유도형 홈페이지이며, 실제 가입 처리는 후속 상담을 통해 진행됩니다.</p>
              <p>1차 제작물 기준으로 일부 상품/혜택/후기 정보는 가상 데이터로 제공될 수 있습니다.</p>
            </div>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
