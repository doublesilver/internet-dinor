import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { getSiteSettings } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "이용약관",
  description: "인터넷공룡 이용약관"
};

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <SiteShell settings={settings}>
      <section className="section-space">
        <div className="container-page max-w-4xl">
          <article className="surface-card space-y-8 prose prose-sm max-w-none">
            <h1 className="text-4xl font-black tracking-tight text-brand-graphite">이용약관</h1>
            <p className="text-sm text-brand-slate">시행일: 2025년 1월 1일</p>

            <div className="space-y-6 text-sm leading-7 text-brand-slate">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제1조 (목적)</h2>
                <p>
                  본 약관은 {settings.siteName}(이하 &ldquo;회사&rdquo;)이 운영하는 인터넷 홈페이지(이하 &ldquo;사이트&rdquo;)를 이용함에 있어
                  회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제2조 (정의)</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>&ldquo;사이트&rdquo;란 회사가 인터넷/TV/통신 상품 상담 서비스를 제공하기 위해 운영하는 웹사이트를 말합니다.</li>
                  <li>&ldquo;이용자&rdquo;란 사이트에 접속하여 본 약관에 따라 사이트가 제공하는 서비스를 이용하는 자를 말합니다.</li>
                  <li>&ldquo;상담 접수&rdquo;란 이용자가 인터넷/TV 가입을 위해 상담을 신청하는 행위를 말합니다.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제3조 (약관의 효력 및 변경)</h2>
                <p>본 약관은 사이트 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다. 회사는 합리적인 사유가 있을 경우 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 공지사항을 통해 사전 안내합니다.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제4조 (서비스의 내용)</h2>
                <p>회사는 이용자에게 아래와 같은 서비스를 제공합니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>KT, SK브로드밴드, LG유플러스, KT스카이라이프, 헬로비전 등 통신사 인터넷/TV 상품 정보 안내</li>
                  <li>통신사별 요금 비교 및 혜택 안내</li>
                  <li>인터넷/TV 가입 상담 접수 서비스</li>
                  <li>빠른 견적 문의 및 전화 상담 연결</li>
                </ul>
                <p>본 사이트는 상담 유도형 홈페이지이며, 실제 가입 처리는 후속 상담을 통해 진행됩니다.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제5조 (서비스 이용)</h2>
                <p>이용자는 본 약관 및 관계 법령을 준수하여야 합니다. 이용자는 다음 행위를 하여서는 안 됩니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>허위 정보를 입력하여 상담을 신청하는 행위</li>
                  <li>타인의 개인정보를 도용하여 상담을 신청하는 행위</li>
                  <li>사이트 운영을 방해하는 행위</li>
                  <li>기타 불법적이거나 부당한 행위</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제6조 (개인정보 보호)</h2>
                <p>
                  회사는 이용자의 개인정보를 보호하기 위해 개인정보처리방침을 수립하고 준수합니다.
                  자세한 내용은 사이트 내 &ldquo;개인정보처리방침&rdquo;을 확인하시기 바랍니다.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제7조 (면책조항)</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
                  <li>회사는 이용자의 귀책 사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</li>
                  <li>사이트에 게시된 통신사별 상품 정보, 요금, 사은품 등의 혜택은 통신사 정책에 따라 변경될 수 있으며, 최종 혜택은 상담을 통해 확인하시기 바랍니다.</li>
                  <li>회사는 이용자가 사이트를 통해 기대하는 수익이나 혜택을 보장하지 않습니다.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제8조 (분쟁 해결)</h2>
                <p>
                  회사와 이용자 간에 발생한 분쟁은 상호 협의하여 해결하는 것을 원칙으로 합니다.
                  협의가 이루어지지 않는 경우 관련 법령 및 상관례에 따르며, 소송이 필요한 경우 회사 소재지를 관할하는 법원을 관할 법원으로 합니다.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제9조 (연락처)</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>상호명: {settings.siteName}</li>
                  <li>대표자: {settings.businessInfo.owner}</li>
                  <li>주소: {settings.businessInfo.address}</li>
                  <li>전화: {settings.phoneLabel}</li>
                  <li>이메일: {settings.businessInfo.email}</li>
                </ul>
              </section>
            </div>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
