"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productInquiryFieldConfig } from "@/data/form-configs/product-inquiry";
import { buildProductInquiryPayload } from "@/lib/utils/inquiry-form";
import { productInquirySchema } from "@/lib/validators/inquiries";
import type { ProductInquiryValues } from "@/lib/validators/inquiries";
import type { Product } from "@/types/domain";
import { Button } from "@/components/ui/Button";

const defaultProductInquiryPayload = {
  signup_type: "",
  desired_bundle: "",
  desired_speed: "",
  tv_required: "",
  mobile_bundle_interest: "",
  memo: ""
};

export function ProductInquiryForm({ product }: { product: Product }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProductInquiryValues>({
    resolver: zodResolver(productInquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      privacyAgreed: false,
      productSlug: product.slug,
      sourcePage: `/products/${product.slug}`,
      regionLabel: "",
      contactTimePreference: "",
      payload: defaultProductInquiryPayload
    }
  });

  const onSubmit = handleSubmit((values) => {
    const payload = buildProductInquiryPayload(Object.entries(values.payload ?? {}));

    startTransition(async () => {
      try {
        const response = await fetch("/api/inquiries/product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            payload
          })
        });

        const result = (await response.json()) as { success: boolean; message?: string };
        if (!response.ok || !result.success) {
          setMessage(result.message ?? "문의 접수에 실패했습니다.");
          return;
        }

        setMessage(null);
        router.push("/inquiry/complete");
      } catch {
        setMessage("문의 접수 중 오류가 발생했습니다.");
      }
    });
  });

  return (
    <form id={`product-form-${product.slug}`} onSubmit={onSubmit} className="surface-card space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="product-name" className="field-label">이름</label>
          <input id="product-name" className="field-base" placeholder="홍길동" {...register("name")} />
          {errors.name ? <p className="field-error">{errors.name.message}</p> : null}
        </div>
        <div>
          <label htmlFor="product-phone" className="field-label">연락처</label>
          <input id="product-phone" className="field-base" placeholder="010-1234-5678" {...register("phone")} />
          {errors.phone ? <p className="field-error">{errors.phone.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {productInquiryFieldConfig.map((field) => (
          <div key={field.key}>
            <label className="field-label">{field.label}</label>
            <select className="field-base" {...register(`payload.${field.key}`)}>
              <option value="">선택해주세요</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="product-region" className="field-label">설치 지역</label>
          <input id="product-region" className="field-base" placeholder="예: 서울 강동구" {...register("regionLabel")} />
        </div>
        <div>
          <label htmlFor="product-contact-time" className="field-label">연락 희망 시간</label>
          <select id="product-contact-time" className="field-base" {...register("contactTimePreference")}>
            <option value="">선택해주세요</option>
            <option value="morning">오전</option>
            <option value="afternoon">오후</option>
            <option value="evening">저녁</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="product-memo" className="field-label">문의 메모</label>
        <textarea
          id="product-memo"
          className="field-base min-h-28"
          placeholder="이사 예정일, 사업장 여부 등을 적어주세요."
          {...register("payload.memo")}
        />
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-brand-border px-4 py-3 text-sm text-brand-slate">
        <input type="checkbox" className="mt-1" {...register("privacyAgreed")} />
        <span>개인정보 수집 및 상담 연락에 동의합니다.</span>
      </label>
      {errors.privacyAgreed ? <p className="field-error">{errors.privacyAgreed.message}</p> : null}

      {message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{message}</p> : null}
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? "접수 중..." : "이 상품 문의 접수"}
      </Button>
    </form>
  );
}
