import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { getSiteSettings } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "인터넷공룡 개인정보처리방침"
};

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <SiteShell settings={settings}>
      <section className="section-space">
        <div className="container-page max-w-4xl">
          <article className="surface-card space-y-8 prose prose-sm max-w-none">
            <h1 className="text-4xl font-black tracking-tight text-brand-graphite">개인정보처리방침</h1>
            <p className="text-sm text-brand-slate">시행일: 2025년 1월 1일</p>

            <div className="space-y-6 text-sm leading-7 text-brand-slate">
              <p>
                {settings.siteName}(이하 &ldquo;회사&rdquo;)은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
                본 방침은 회사가 수집하는 개인정보의 항목, 수집 목적, 보유 기간 및 이용자 권리에 대해 안내합니다.
              </p>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제1조 (수집하는 개인정보 항목)</h2>
                <p>회사는 상담 접수를 위해 아래와 같은 개인정보를 수집합니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>필수 항목: 이름, 휴대전화번호</li>
                  <li>문의 유형별 추가 항목: 설치 지역(시/구), 희망 통신사, 희망 상품, 고객 유형, 연락 희망 시간</li>
                  <li>선택 항목: 휴대폰 통신사, 납부방법 선호, 희망 설치일, 유입 경로, 상담 메모</li>
                </ul>
                <p>회사는 웹 문의 단계에서 계좌번호, 카드번호, 상세 주소, 사은품 수령 계좌 등 금융 및 상세 주소 정보는 수집하지 않습니다.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제2조 (개인정보 수집 목적)</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>인터넷/TV/통신 상품 상담 접수 및 안내</li>
                  <li>상담 예약 확인 및 결과 통보</li>
                  <li>민원 처리 및 고객 응대</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제3조 (개인정보 보유 및 이용 기간)</h2>
                <p>수집된 개인정보는 상담 완료 후 1년간 보관하며, 이후 지체 없이 파기합니다. 단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>전자상거래 관련 기록: 5년 (전자상거래법)</li>
                  <li>소비자 불만 또는 분쟁 처리 기록: 3년 (전자상거래법)</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제4조 (개인정보의 제3자 제공)</h2>
                <p>회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우는 예외로 합니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>이용자가 사전에 동의한 경우</li>
                  <li>법령의 규정에 의거하거나, 수사 목적으로 법령에서 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제5조 (개인정보 처리 위탁)</h2>
                <p>회사는 서비스 향상을 위해 아래와 같이 개인정보 처리 업무를 위탁할 수 있으며, 위탁 계약 시 개인정보가 안전하게 관리될 수 있도록 관련 규정을 준수합니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>수탁자: 각 통신사(KT, SK브로드밴드, LG유플러스 등) 상담 연계 업무</li>
                  <li>위탁 업무 내용: 가입 신청 처리 및 설치 안내, 상담 확정 이후 필요한 추가 정보 확인</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제6조 (이용자의 권리)</h2>
                <p>이용자는 언제든지 아래 권리를 행사할 수 있습니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>개인정보 열람 요구</li>
                  <li>오류 등이 있을 경우 정정 요구</li>
                  <li>삭제 요구</li>
                  <li>처리 정지 요구</li>
                </ul>
                <p>권리 행사는 이메일({settings.businessInfo.email}) 또는 전화({settings.phoneLabel})를 통해 요청하실 수 있으며, 지체 없이 조치하겠습니다.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제7조 (개인정보의 파기)</h2>
                <p>보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다. 전자적 파일 형태의 정보는 복구 및 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이 문서는 분쇄기로 분쇄하거나 소각합니다.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제8조 (개인정보 보호책임자)</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>책임자: {settings.businessInfo.owner}</li>
                  <li>이메일: help@internetdinor.co.kr</li>
                  <li>전화: {settings.phoneLabel}</li>
                </ul>
                <p>개인정보 침해 관련 신고 및 상담은 아래 기관에 문의하실 수 있습니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>개인정보분쟁조정위원회: www.kopico.go.kr (1833-6972)</li>
                  <li>개인정보침해신고센터: privacy.kisa.or.kr (118)</li>
                  <li>대검찰청: www.spo.go.kr (1301)</li>
                  <li>경찰청: ecrm.cyber.go.kr (182)</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-brand-graphite">제9조 (개인정보처리방침 변경)</h2>
                <p>본 방침은 법령 및 내부 정책에 따라 변경될 수 있으며, 변경 시 홈페이지 공지사항을 통해 사전 공지합니다.</p>
              </section>
            </div>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
