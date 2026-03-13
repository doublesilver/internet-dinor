"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import DaumPostcodeEmbed from "react-daum-postcode";
import { useController, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildApplyInquiryPayload, extractRegionLabel } from "@/lib/utils/inquiry-form";
import { applyInquirySchema } from "@/lib/validators/inquiries";
import type { ApplyInquiryValues } from "@/lib/validators/inquiries";

const carrierOptions = [
  { value: "sk", label: "SK브로드밴드" },
  { value: "kt", label: "KT" },
  { value: "lg", label: "LG유플러스" },
  { value: "skylife", label: "KT스카이라이프" },
  { value: "hellovision", label: "LG헬로비전" }
];

const currentCarrierOptions = [
  ...carrierOptions,
  { value: "local_cable", label: "지역케이블" },
  { value: "none", label: "없음" },
  { value: "other", label: "기타" }
];

const internetPlansByCarrier: Record<string, Array<{ value: string; label: string }>> = {
  sk: [
    { value: "100M", label: "100M" },
    { value: "500M", label: "500M" },
    { value: "1G", label: "1G (기가)" }
  ],
  kt: [
    { value: "100M", label: "100M" },
    { value: "500M", label: "500M" },
    { value: "1G", label: "1G (기가)" }
  ],
  lg: [
    { value: "100M", label: "100M" },
    { value: "500M", label: "500M" },
    { value: "1G", label: "1G (기가)" }
  ],
  skylife: [{ value: "100M", label: "100M" }],
  hellovision: [{ value: "100M", label: "100M" }]
};

const tvPlansByCarrier: Record<string, Array<{ value: string; label: string }>> = {
  sk: [
    { value: "none", label: "선택안함" },
    { value: "economy", label: "이코노미 (183ch)" },
    { value: "standard", label: "스탠다드 (234ch)" },
    { value: "all", label: "ALL (257ch)" }
  ],
  kt: [
    { value: "none", label: "선택안함" },
    { value: "basic", label: "베이직" },
    { value: "standard", label: "스탠다드" },
    { value: "premium", label: "프리미엄" }
  ],
  lg: [
    { value: "none", label: "선택안함" },
    { value: "basic", label: "베이직" },
    { value: "standard", label: "스탠다드" },
    { value: "premium", label: "프리미엄" }
  ],
  skylife: [
    { value: "none", label: "선택안함" },
    { value: "sky_all", label: "SKY ALL" },
    { value: "sky_basic", label: "SKY 베이직" }
  ],
  hellovision: [
    { value: "none", label: "선택안함" },
    { value: "economy", label: "이코노미" },
    { value: "standard", label: "스탠다드" }
  ]
};

const customerTypes = [
  { value: "individual", label: "개인" },
  { value: "sole_proprietor", label: "개인사업자" },
  { value: "corporation", label: "법인" },
  { value: "minor", label: "미성년자" },
  { value: "foreigner", label: "외국인" }
];

const sourceOptions = ["네이버", "카카오", "당근", "구글", "유튜브", "토스", "카드사", "지인추천", "기존가입자", "기타"];
const mobileCarriers = ["SKT", "KT", "LG U+", "SK알뜰", "KT알뜰", "LG알뜰"];

type ApplyInquiryFormProps = {
  phoneLink: string;
};

export function ApplyInquiryForm({ phoneLink }: ApplyInquiryFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [showPostcode, setShowPostcode] = useState(false);
  const [addressPreview, setAddressPreview] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<ApplyInquiryValues>({
    resolver: zodResolver(applyInquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      sourcePage: "/apply",
      privacyAgreed: false,
      termsAgreed: false,
      regionLabel: "",
      contactTimePreference: "",
      payload: {
        current_carrier: "",
        desired_carrier: "",
        internet_plan: "",
        tv_plan: "",
        customer_type: "individual",
        mobile_carrier: "",
        payment_method: "auto_transfer",
        install_date_type: "asap",
        install_date: "",
        source_channel: "",
        memo: ""
      }
    }
  });

  const customerType = useWatch({ control, name: "payload.customer_type" }) ?? "individual";
  const paymentMethod = useWatch({ control, name: "payload.payment_method" }) ?? "auto_transfer";
  const { field: desiredCarrierField } = useController({ control, name: "payload.desired_carrier" });
  const { field: installDateTypeField } = useController({ control, name: "payload.install_date_type" });
  const { field: regionLabelField } = useController({ control, name: "regionLabel" });
  const desiredCarrier = desiredCarrierField.value ?? "";
  const installDateType = installDateTypeField.value ?? "asap";

  const onSubmit = handleSubmit((values) => {
    setMessage(null);
    const payload = buildApplyInquiryPayload(Object.entries(values.payload ?? {}));

    startTransition(async () => {
      try {
        const response = await fetch("/api/inquiries/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            sourcePage: "/apply",
            payload
          })
        });

        const result = (await response.json()) as { success: boolean; message?: string };
        if (!response.ok || !result.success) {
          setMessage(result.message ?? "신청 접수에 실패했습니다.");
          return;
        }

        window.location.href = "/inquiry/complete";
      } catch {
        setMessage("신청 접수 중 오류가 발생했습니다.");
      }
    });
  });

  const internetPlans = desiredCarrier ? (internetPlansByCarrier[desiredCarrier] ?? []) : [];
  const tvPlans = desiredCarrier ? (tvPlansByCarrier[desiredCarrier] ?? []) : [];

  return (
    <form id="apply-form" onSubmit={onSubmit} className="space-y-8">
      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">현재 인터넷 통신사</legend>
        <div className="flex flex-wrap gap-2">
          {currentCarrierOptions.map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
              <input type="radio" value={opt.value} className="accent-brand-orange" {...register("payload.current_carrier")} />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">희망 통신사</legend>
        <div className="flex flex-wrap gap-2">
          {carrierOptions.map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
              <input
                type="radio"
                value={opt.value}
                className="accent-brand-orange"
                name={desiredCarrierField.name}
                ref={desiredCarrierField.ref}
                checked={desiredCarrierField.value === opt.value}
                onBlur={desiredCarrierField.onBlur}
                onChange={() => {
                  desiredCarrierField.onChange(opt.value);
                  setValue("payload.internet_plan", "", { shouldDirty: true, shouldValidate: true });
                  setValue("payload.tv_plan", "", { shouldDirty: true, shouldValidate: true });
                }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {desiredCarrier && internetPlans.length > 0 && (
        <fieldset className="surface-card space-y-4">
          <legend className="text-base font-bold text-brand-graphite">인터넷 상품</legend>
          <div className="flex flex-wrap gap-2">
            {internetPlans.map((opt) => (
              <label key={opt.value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
                <input type="radio" value={opt.value} className="accent-brand-orange" {...register("payload.internet_plan")} />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {desiredCarrier && tvPlans.length > 0 && (
        <fieldset className="surface-card space-y-4">
          <legend className="text-base font-bold text-brand-graphite">TV 상품</legend>
          <div className="flex flex-wrap gap-2">
            {tvPlans.map((opt) => (
              <label key={opt.value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
                <input type="radio" value={opt.value} className="accent-brand-orange" {...register("payload.tv_plan")} />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">고객 유형</legend>
        <div className="flex flex-wrap gap-2">
          {customerTypes.map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
              <input type="radio" value={opt.value} className="accent-brand-orange" {...register("payload.customer_type")} />
              {opt.label}
            </label>
          ))}
        </div>
        {customerType === "minor" ? (
          <p className="rounded-xl border border-brand-border bg-brand-surface px-4 py-3 text-sm text-brand-slate">
            미성년자 가입은 법정대리인 확인이 필요하며, 세부 정보는 상담 과정에서 안전하게 별도 확인합니다.
          </p>
        ) : null}
      </fieldset>

      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">개인 정보</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="field-label">이름 *</label>
            <input className="field-base" placeholder="홍길동" {...register("name")} />
            {errors.name ? <p className="field-error">{errors.name.message}</p> : null}
          </div>
          <div>
            <label className="field-label">휴대폰 *</label>
            <input className="field-base" placeholder="010-1234-5678" {...register("phone")} />
            {errors.phone ? <p className="field-error">{errors.phone.message}</p> : null}
          </div>
          <div>
            <label className="field-label">휴대폰 통신사</label>
            <select className="field-base" {...register("payload.mobile_carrier")}>
              <option value="">선택해주세요</option>
              {mobileCarriers.map((mobileCarrier) => (
                <option key={mobileCarrier} value={mobileCarrier}>
                  {mobileCarrier}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">연락 희망 시간</label>
            <select className="field-base" {...register("contactTimePreference")}>
              <option value="">선택해주세요</option>
              <option value="morning">오전 (10시~12시)</option>
              <option value="afternoon">오후 (12시~17시)</option>
              <option value="evening">저녁 (17시~19시)</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">설치 지역</legend>
        <div className="grid gap-4">
          <div className="flex gap-2">
            <input
              className="field-base flex-1"
              placeholder="예: 서울 강동구"
              name={regionLabelField.name}
              ref={regionLabelField.ref}
              value={regionLabelField.value ?? ""}
              onBlur={regionLabelField.onBlur}
              onChange={(event) => {
                regionLabelField.onChange(event.target.value);
                if (addressPreview) {
                  setAddressPreview("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => setShowPostcode(true)}
              className="shrink-0 rounded-xl border border-brand-orange px-4 py-2 text-sm font-bold text-brand-orange hover:bg-orange-50"
            >
              주소 검색
            </button>
          </div>
          {errors.regionLabel ? <p className="field-error">{errors.regionLabel.message}</p> : null}
          <p className="text-xs text-brand-slate">
            웹에서는 설치 지역(시/구)까지만 접수합니다. 상세 주소는 상담 과정에서 안전하게 별도 확인합니다.
          </p>
          {addressPreview ? (
            <p className="rounded-xl border border-brand-border bg-brand-surface px-4 py-3 text-sm text-brand-slate">
              선택된 주소: {addressPreview}
            </p>
          ) : null}
        </div>

        {showPostcode ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowPostcode(false)}>
            <div
              className="relative w-full max-w-md rounded-2xl bg-white p-4 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowPostcode(false)}
                className="absolute right-4 top-4 text-brand-slate hover:text-brand-graphite"
                aria-label="닫기"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <p className="mb-3 text-sm font-bold text-brand-graphite">주소 검색</p>
              <DaumPostcodeEmbed
                onComplete={(data) => {
                  const nextAddress = data.roadAddress || data.jibunAddress;
                  const nextRegionLabel = extractRegionLabel(nextAddress);
                  setAddressPreview(nextAddress);
                  regionLabelField.onChange(nextRegionLabel || nextAddress);
                  setShowPostcode(false);
                }}
                style={{ height: 400 }}
              />
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">납부 방법 선호</legend>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "auto_transfer", label: "자동이체(은행)" },
            { value: "credit_card", label: "신용카드" },
            { value: "giro", label: "지로" }
          ].map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
              <input type="radio" value={opt.value} className="accent-brand-orange" {...register("payload.payment_method")} />
              {opt.label}
            </label>
          ))}
        </div>
        <p className="rounded-xl border border-brand-border bg-brand-surface px-4 py-3 text-sm text-brand-slate">
          계좌번호, 카드번호, 사은품 수령 계좌는 웹에서 받지 않습니다. {paymentMethod === "credit_card" ? "카드 납부" : "납부"} 관련 세부 정보는 상담 확정 후 안전하게 별도 확인합니다.
        </p>
      </fieldset>

      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">설치 희망일</legend>
        <div className="flex flex-wrap gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
            <input
              type="radio"
              value="asap"
              className="accent-brand-orange"
              name={installDateTypeField.name}
              ref={installDateTypeField.ref}
              checked={installDateTypeField.value === "asap"}
              onBlur={installDateTypeField.onBlur}
              onChange={() => {
                installDateTypeField.onChange("asap");
                setValue("payload.install_date", "", { shouldDirty: true, shouldValidate: true });
              }}
            />
            빠른 시일 희망
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
            <input
              type="radio"
              value="custom"
              className="accent-brand-orange"
              name={installDateTypeField.name}
              ref={installDateTypeField.ref}
              checked={installDateTypeField.value === "custom"}
              onBlur={installDateTypeField.onBlur}
              onChange={() => installDateTypeField.onChange("custom")}
            />
            직접 선택
          </label>
        </div>
        {installDateType === "custom" ? (
          <input
            type="date"
            className="field-base"
            min={new Date().toISOString().split("T")[0]}
            {...register("payload.install_date")}
          />
        ) : null}
      </fieldset>

      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">유입 경로</legend>
        <div className="flex flex-wrap gap-2">
          {sourceOptions.map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border px-3 py-2 text-sm hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
              <input type="radio" value={opt} className="accent-brand-orange" {...register("payload.source_channel")} />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">남기실 말씀</legend>
        <textarea
          className="field-base min-h-28"
          placeholder="상담 시 꼭 확인하고 싶은 내용을 적어주세요."
          {...register("payload.memo")}
        />
      </fieldset>

      <div className="surface-card space-y-3">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-border px-4 py-3 text-sm text-brand-slate hover:border-brand-orange">
          <input type="checkbox" className="mt-1 accent-brand-orange" {...register("termsAgreed")} />
          <span>
            서비스 <Link href="/policy/terms" className="text-brand-orange underline" target="_blank">이용약관</Link>에 동의합니다.
          </span>
        </label>
        {errors.termsAgreed ? <p className="field-error">{errors.termsAgreed.message}</p> : null}

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-border px-4 py-3 text-sm text-brand-slate hover:border-brand-orange">
          <input type="checkbox" className="mt-1 accent-brand-orange" {...register("privacyAgreed")} />
          <span>
            <Link href="/policy/privacy" className="text-brand-orange underline" target="_blank">개인정보 수집 및 이용</Link>에 동의합니다.
          </span>
        </label>
        {errors.privacyAgreed ? <p className="field-error">{errors.privacyAgreed.message}</p> : null}
      </div>
      {message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{message}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-2xl bg-brand-orange px-6 py-4 text-base font-bold text-white hover:bg-brand-orange-dark disabled:opacity-50"
        >
          {isPending ? "접수 중..." : "가입 신청하기"}
        </button>
        <a
          href={phoneLink}
          className="flex-1 rounded-2xl border border-brand-orange px-6 py-4 text-center text-base font-bold text-brand-orange hover:bg-orange-50"
        >
          전화 문의
        </a>
      </div>
    </form>
  );
}
