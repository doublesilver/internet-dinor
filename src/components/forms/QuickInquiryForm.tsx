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
      <label className="flex items-start gap-3 rounded-2xl border border-brand-border px-4 py-3 text-sm text-brand-slate">
        <input type="checkbox" className="mt-1" {...register("privacyAgreed")} />
        <span>개인정보 수집 및 상담 연락에 동의합니다.</span>
      </label>
      {errors.privacyAgreed ? <p className="field-error">{errors.privacyAgreed.message}</p> : null}
      {message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{message}</p> : null}
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? "접수 중..." : submitLabel}
      </Button>
    </form>
  );
}
