"use client";

import { useState } from "react";

export function DisclaimerSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-surface">
      <button
        type="button"
        className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-brand-graphite"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        주의사항 / 약관 안내
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="4 6 8 10 12 6" />
        </svg>
      </button>
      {open && (
        <div className="space-y-1.5 border-t border-brand-border px-6 py-4 text-xs leading-5 text-brand-slate">
          <p>• 모든 요금은 부가세 포함 기준이며, <strong className="text-brand-graphite">3년 약정</strong> 시 적용되는 할인가입니다.</p>
          <p>• 약정 기간 내 해지 시 위약금이 발생할 수 있으며, 잔여 약정 기간에 따라 금액이 다릅니다.</p>
          <p>• 사은품은 개통 완료 후 지급되며, <strong className="text-brand-graphite">동일 장소 3개월 이내 해지 시 사은품 전액이 환수</strong>됩니다.</p>
          <p>• 장기 미납 또는 강제 해지 시에도 사은품 환수 조건이 적용됩니다.</p>
          <p>• 기초생활수급자·차상위계층 등 복지할인 적용 시 <strong className="text-brand-graphite">결합할인과 중복 적용이 불가</strong>합니다.</p>
          <p>• 개통 후 <strong className="text-brand-graphite">명의변경은 원칙적으로 제한</strong>되며, 가족 간 명의변경만 예외적으로 허용될 수 있습니다.</p>
          <p>• 설치 환경(건물 구조, 배선 상태 등)에 따라 실제 제공 속도는 표기 속도와 차이가 있을 수 있습니다.</p>
          <p>• 채널 수는 지역 및 케이블 방송 권역에 따라 다를 수 있습니다.</p>
          <p>• 결합할인은 동일 명의의 이동전화 회선 수 및 요금제 기준으로 산정됩니다.</p>
          <p>• 이벤트·프로모션 혜택은 기간 한정이며, 통신사 정책에 따라 사전 예고 없이 변경 또는 종료될 수 있습니다.</p>
          <p>• 본 페이지에 기재된 요금 및 혜택 정보는 참고용이며, 최종 적용 조건은 가입 시 계약서를 기준으로 합니다.</p>
        </div>
      )}
    </div>
  );
}
