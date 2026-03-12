"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyInquirySchema } from "@/lib/validators/inquiries";
import type { ApplyInquiryValues } from "@/lib/validators/inquiries";
import { Button } from "@/components/ui/Button";

export function ApplyInquiryForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ApplyInquiryValues>({
    resolver: zodResolver(applyInquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      sourcePage: "/apply",
      privacyAgreed: false,
      regionLabel: "",
      contactTimePreference: "",
      payload: {}
    }
  });

  const onSubmit = handleSubmit((values, event) => {
    const formData = new FormData(event?.target as HTMLFormElement);
    const payload = Object.fromEntries(
      Array.from(formData.entries()).filter(([key]) =>
        ["signup_type", "desired_bundle", "desired_speed", "tv_required", "mobile_bundle_interest", "memo", "interest_product"].includes(key)
      )
    );

    startTransition(async () => {
      const response = await fetch("/api/inquiries/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          payload
        })
      });

      const result = (await response.json()) as { success: boolean; message?: string };
      if (!response.ok || !result.success) {
        setMessage(result.message ?? "신청 접수에 실패했습니다.");
        return;
      }

      setMessage(null);
      window.location.href = "/inquiry/complete";
    });
  });

  return (
    <form id="apply-form" onSubmit={onSubmit} className="surface-card space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="field-label">이름</label>
          <input className="field-base" placeholder="홍길동" {...register("name")} />
          {errors.name ? <p className="field-error">{errors.name.message}</p> : null}
        </div>
        <div>
          <label className="field-label">연락처</label>
          <input className="field-base" placeholder="010-1234-5678" {...register("phone")} />
          {errors.phone ? <p className="field-error">{errors.phone.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="field-label">설치 지역</label>
          <input className="field-base" placeholder="예: 서울 강동구" {...register("regionLabel")} />
        </div>
        <div>
          <label className="field-label">연락 희망 시간</label>
          <select className="field-base" {...register("contactTimePreference")}>
            <option value="">선택해주세요</option>
            <option value="morning">오전</option>
            <option value="afternoon">오후</option>
            <option value="evening">저녁</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="field-label">가입 유형</label>
          <select name="signup_type" className="field-base" defaultValue="">
            <option value="">선택해주세요</option>
            <option value="new">신규 가입</option>
            <option value="carrier_change">통신사 변경</option>
            <option value="renewal">재약정 문의</option>
          </select>
        </div>
        <div>
          <label className="field-label">희망 구성</label>
          <select name="desired_bundle" className="field-base" defaultValue="">
            <option value="">선택해주세요</option>
            <option value="internet_only">인터넷 단독</option>
            <option value="internet_tv">인터넷 + TV</option>
          </select>
        </div>
        <div>
          <label className="field-label">희망 속도</label>
          <select name="desired_speed" className="field-base" defaultValue="">
            <option value="">선택해주세요</option>
            <option value="100M">100M</option>
            <option value="500M">500M</option>
            <option value="1G">1G</option>
          </select>
        </div>
        <div>
          <label className="field-label">관심 상품</label>
          <input name="interest_product" className="field-base" placeholder="예: 안심 500 + TV 베이직" />
        </div>
      </div>

      <div>
        <label className="field-label">남기실 말씀</label>
        <textarea name="memo" className="field-base min-h-28" placeholder="상담 시 꼭 확인하고 싶은 내용을 적어주세요." />
      </div>

      <input type="hidden" {...register("sourcePage")} value="/apply" />

      <label className="flex items-start gap-3 rounded-2xl border border-brand-border px-4 py-3 text-sm text-brand-slate">
        <input type="checkbox" className="mt-1" {...register("privacyAgreed")} />
        <span>개인정보 수집 및 상담 연락에 동의합니다.</span>
      </label>
      {errors.privacyAgreed ? <p className="field-error">{errors.privacyAgreed.message}</p> : null}

      {message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{message}</p> : null}
      <div className="flex flex-col gap-3 md:flex-row">
        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? "접수 중..." : "상담 신청하기"}
        </Button>
        <Button href="tel:16601234" variant="secondary" fullWidth>
          전화로 문의하기
        </Button>
      </div>
    </form>
  );
}
