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
        유의사항
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="4 6 8 10 12 6" />
        </svg>
      </button>
      {open && (
        <div className="space-y-2 border-t border-brand-border px-6 py-4 text-xs leading-5 text-brand-slate">
          <p>• 모든 요금은 부가세 포함 기준이며, 3년 약정 시 적용되는 할인가입니다.</p>
          <p>• 약정 기간 내 해지 시 위약금이 발생할 수 있습니다.</p>
          <p>• 사은품은 개통 완료 후 지급되며, 동일 장소 3개월 이내 해지 시 전액 환수됩니다.</p>
          <p>• 설치 환경에 따라 실제 속도는 차이가 있을 수 있습니다.</p>
          <p>• 채널 수는 지역 및 상품에 따라 다를 수 있습니다.</p>
          <p>• 상기 내용은 통신사 정책에 따라 변경될 수 있습니다.</p>
        </div>
      )}
    </div>
  );
}
