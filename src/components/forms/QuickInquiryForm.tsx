"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quickInquirySchema } from "@/lib/validators/inquiries";
import type { QuickInquiryValues } from "@/lib/validators/inquiries";
import { Button } from "@/components/ui/Button";

export function QuickInquiryForm({ sourcePage, submitLabel = "30초 상담 받기" }: { sourcePage: string; submitLabel?: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<QuickInquiryValues>({
    resolver: zodResolver(quickInquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      privacyAgreed: false,
      sourcePage,
      utm: {}
    }
  });

  const onSubmit = handleSubmit((values) => {
    setMessage(null);

    startTransition(async () => {
      const response = await fetch("/api/inquiries/quick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const result = (await response.json()) as { success: boolean; message?: string };

      if (!response.ok || !result.success) {
        setMessage(result.message ?? "문의 접수에 실패했습니다.");
        return;
      }

      reset();
      window.location.href = "/inquiry/complete";
    });
  });

  return (
    <form onSubmit={onSubmit} className="surface-card space-y-4">
      <div>
        <label htmlFor={`quick-name-${sourcePage}`} className="field-label">
          이름
        </label>
        <input id={`quick-name-${sourcePage}`} className="field-base" placeholder="홍길동" {...register("name")} />
        {errors.name ? <p className="field-error">{errors.name.message}</p> : null}
      </div>
      <div>
        <label htmlFor={`quick-phone-${sourcePage}`} className="field-label">
          연락처
        </label>
        <input id={`quick-phone-${sourcePage}`} className="field-base" placeholder="010-1234-5678" {...register("phone")} />
        {errors.phone ? <p className="field-error">{errors.phone.message}</p> : null}
      </div>
      <input type="hidden" {...register("sourcePage")} value={sourcePage} />
      <div className="space-y-2">
        <label className="flex items-start gap-3 rounded-2xl border border-brand-border px-4 py-3 text-sm text-brand-slate">
          <input type="checkbox" className="mt-1" {...register("privacyAgreed")} />
          <span>개인정보 수집 및 상담 연락에 동의합니다.</span>
        </label>
        <div className="max-h-[120px] overflow-y-auto rounded-xl border border-brand-border bg-gray-50 p-3 text-xs leading-relaxed text-gray-500">
          <p className="mb-2 font-semibold text-gray-700">개인정보 수집 및 이용 안내</p>
          <p className="mb-1"><strong>1. 수집 항목:</strong> 이름, 연락처(휴대폰 번호)</p>
          <p className="mb-1"><strong>2. 수집 목적:</strong> 인터넷/TV 상품 상담 및 가입 안내, 사은품 지급 관련 연락</p>
          <p className="mb-1"><strong>3. 보유 기간:</strong> 상담 완료 후 6개월 이내 파기 (단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보존)</p>
          <p className="mb-1"><strong>4. 동의 거부 권리:</strong> 개인정보 수집 및 이용에 대한 동의를 거부하실 수 있으나, 이 경우 상담 서비스 제공이 제한될 수 있습니다.</p>
          <p className="mb-1"><strong>5. 제3자 제공:</strong> 수집된 개인정보는 상담 목적 외에 제3자에게 제공되지 않습니다.</p>
          <p><strong>6. 위탁:</strong> 원활한 서비스 제공을 위해 통신사(SK브로드밴드, KT, LG유플러스 등)에 가입 처리 목적으로 개인정보 처리를 위탁할 수 있습니다.</p>
        </div>
      </div>
      {errors.privacyAgreed ? <p className="field-error">{errors.privacyAgreed.message}</p> : null}
      {message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{message}</p> : null}
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? "접수 중..." : submitLabel}
      </Button>
    </form>
  );
}
