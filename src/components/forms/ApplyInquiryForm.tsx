"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyInquirySchema } from "@/lib/validators/inquiries";
import type { ApplyInquiryValues } from "@/lib/validators/inquiries";
import Link from "next/link";
import DaumPostcodeEmbed from "react-daum-postcode";

const SITE_PHONE = "tel:16601234";

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

const internetPlansByCarrier: Record<string, { value: string; label: string }[]> = {
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
  skylife: [
    { value: "100M", label: "100M" }
  ],
  hellovision: [
    { value: "100M", label: "100M" }
  ]
};

const tvPlansByCarrier: Record<string, { value: string; label: string }[]> = {
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

const sourceOptions = [
  "네이버", "카카오", "당근", "구글", "유튜브", "토스", "카드사", "지인추천", "기존가입자", "기타"
];

const mobileCarriers = ["SKT", "KT", "LG U+", "SK알뜰", "KT알뜰", "LG알뜰"];

const bankOptions = [
  "KB국민", "신한", "우리", "하나", "NH농협", "IBK기업", "SC제일", "씨티",
  "카카오뱅크", "토스뱅크", "케이뱅크", "우체국", "새마을금고", "신협", "수협",
  "광주", "전북", "경남", "대구", "부산", "제주"
];

const cardCompanyOptions = [
  "삼성카드", "현대카드", "롯데카드", "신한카드", "KB국민카드", "우리카드",
  "하나카드", "NH농협카드", "BC카드", "씨티카드"
];

export function ApplyInquiryForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [desiredCarrier, setDesiredCarrier] = useState("");
  const [customerType, setCustomerType] = useState("individual");
  const [installDateType, setInstallDateType] = useState("asap");

  // Address state
  const [showPostcode, setShowPostcode] = useState(false);
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState("auto_transfer");
  const [giftSameAsPayment, setGiftSameAsPayment] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ApplyInquiryValues>({
    resolver: zodResolver(applyInquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      sourcePage: "/apply",
      privacyAgreed: false,
      termsAgreed: false,
      regionLabel: "",
      contactTimePreference: "",
      payload: {}
    }
  });

  const onSubmit = handleSubmit((values, event) => {
    const formData = new FormData(event?.target as HTMLFormElement);
    const payloadKeys = [
      "current_carrier", "desired_carrier", "internet_plan", "tv_plan",
      "customer_type", "mobile_carrier", "zipcode", "address", "address_detail",
      "payment_method", "bank_name", "account_number", "account_holder",
      "card_company", "card_number", "card_expiry",
      "gift_bank_name", "gift_account_number", "gift_account_holder",
      "install_date_type", "install_date", "source_channel", "memo",
      "guardian_name", "guardian_relation"
    ];
    const payload = Object.fromEntries(
      Array.from(formData.entries()).filter(([key]) => payloadKeys.includes(key))
    );

    startTransition(async () => {
      const response = await fetch("/api/inquiries/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, payload })
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

  const internetPlans = desiredCarrier ? (internetPlansByCarrier[desiredCarrier] ?? []) : [];
  const tvPlans = desiredCarrier ? (tvPlansByCarrier[desiredCarrier] ?? []) : [];

  return (
    <form id="apply-form" onSubmit={onSubmit} className="space-y-8">
      {/* Section 1: Current carrier */}
      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">현재 인터넷 통신사</legend>
        <div className="flex flex-wrap gap-2">
          {currentCarrierOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm cursor-pointer hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
              <input type="radio" name="current_carrier" value={opt.value} className="accent-brand-orange" />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Section 2: Desired carrier */}
      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">희망 통신사</legend>
        <div className="flex flex-wrap gap-2">
          {carrierOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm cursor-pointer hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
              <input
                type="radio"
                name="desired_carrier"
                value={opt.value}
                className="accent-brand-orange"
                onChange={(e) => setDesiredCarrier(e.target.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Section 3: Internet plan (conditional) */}
      {desiredCarrier && internetPlans.length > 0 && (
        <fieldset className="surface-card space-y-4">
          <legend className="text-base font-bold text-brand-graphite">인터넷 상품</legend>
          <div className="flex flex-wrap gap-2">
            {internetPlans.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm cursor-pointer hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
                <input type="radio" name="internet_plan" value={opt.value} className="accent-brand-orange" />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {/* Section 4: TV plan (conditional) */}
      {desiredCarrier && tvPlans.length > 0 && (
        <fieldset className="surface-card space-y-4">
          <legend className="text-base font-bold text-brand-graphite">TV 상품</legend>
          <div className="flex flex-wrap gap-2">
            {tvPlans.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm cursor-pointer hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
                <input type="radio" name="tv_plan" value={opt.value} className="accent-brand-orange" />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {/* Section 5: Customer type */}
      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">고객 유형</legend>
        <div className="flex flex-wrap gap-2">
          {customerTypes.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm cursor-pointer hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
              <input
                type="radio"
                name="customer_type"
                value={opt.value}
                className="accent-brand-orange"
                defaultChecked={opt.value === "individual"}
                onChange={(e) => setCustomerType(e.target.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>

        {/* Guardian info (conditional: minor) */}
        {customerType === "minor" && (
          <div className="mt-4 grid gap-4 rounded-xl border border-brand-border bg-brand-surface p-4 md:grid-cols-2">
            <div>
              <label className="field-label">법정대리인 성명</label>
              <input name="guardian_name" className="field-base" placeholder="홍길동" />
            </div>
            <div>
              <label className="field-label">관계</label>
              <input name="guardian_relation" className="field-base" placeholder="부/모" />
            </div>
          </div>
        )}
      </fieldset>

      {/* Section 6: Personal info */}
      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">개인 정보</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="field-label">이름 *</label>
            <input className="field-base" placeholder="홍길동" {...register("name")} />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>
          <div>
            <label className="field-label">휴대폰 *</label>
            <input className="field-base" placeholder="010-1234-5678" {...register("phone")} />
            {errors.phone && <p className="field-error">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="field-label">이메일</label>
            <input className="field-base" placeholder="example@email.com" {...register("email")} />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>
          <div>
            <label className="field-label">휴대폰 통신사</label>
            <select name="mobile_carrier" className="field-base" defaultValue="">
              <option value="">선택해주세요</option>
              {mobileCarriers.map((mc) => (
                <option key={mc} value={mc}>{mc}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Section 7: Address */}
      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">설치 주소</legend>
        <div className="grid gap-4">
          <div className="flex gap-2">
            <input
              name="zipcode"
              className="field-base flex-1"
              placeholder="우편번호"
              readOnly
              value={zipcode}
            />
            <button
              type="button"
              onClick={() => setShowPostcode(true)}
              className="shrink-0 rounded-xl border border-brand-orange px-4 py-2 text-sm font-bold text-brand-orange hover:bg-orange-50"
            >
              주소 검색
            </button>
          </div>
          <input
            name="address"
            className="field-base"
            placeholder="주소 (지역 입력)"
            readOnly
            value={address}
          />
          <input name="address_detail" className="field-base" placeholder="상세주소를 입력해주세요" />
        </div>

        {/* Daum Postcode Modal */}
        {showPostcode && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowPostcode(false)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowPostcode(false)}
                className="absolute right-4 top-4 text-brand-slate hover:text-brand-graphite"
                aria-label="닫기"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <p className="mb-3 text-sm font-bold text-brand-graphite">주소 검색</p>
              <DaumPostcodeEmbed
                onComplete={(data) => {
                  setZipcode(data.zonecode);
                  setAddress(data.roadAddress || data.jibunAddress);
                  setShowPostcode(false);
                }}
                style={{ height: 400 }}
              />
            </div>
          </div>
        )}
      </fieldset>

      {/* Section 8: Payment method */}
      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">납부방법</legend>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "auto_transfer", label: "자동이체(은행)" },
            { value: "credit_card", label: "신용카드" },
            { value: "giro", label: "지로" }
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm cursor-pointer hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
              <input
                type="radio"
                name="payment_method"
                value={opt.value}
                className="accent-brand-orange"
                defaultChecked={opt.value === "auto_transfer"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>

        {/* Auto transfer fields */}
        {paymentMethod === "auto_transfer" && (
          <div className="grid gap-4 rounded-xl border border-brand-border bg-brand-surface p-4 md:grid-cols-2">
            <div>
              <label className="field-label">은행명</label>
              <select name="bank_name" className="field-base" defaultValue="">
                <option value="">선택해주세요</option>
                {bankOptions.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">계좌번호</label>
              <input name="account_number" className="field-base" placeholder="계좌번호를 입력해주세요" />
            </div>
            <div>
              <label className="field-label">예금주</label>
              <input name="account_holder" className="field-base" placeholder="예금주명" />
            </div>
          </div>
        )}

        {/* Credit card fields */}
        {paymentMethod === "credit_card" && (
          <div className="grid gap-4 rounded-xl border border-brand-border bg-brand-surface p-4 md:grid-cols-2">
            <div>
              <label className="field-label">카드사</label>
              <select name="card_company" className="field-base" defaultValue="">
                <option value="">선택해주세요</option>
                {cardCompanyOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">카드번호</label>
              <input name="card_number" className="field-base" placeholder="카드번호를 입력해주세요" />
            </div>
            <div>
              <label className="field-label">유효기간</label>
              <input name="card_expiry" className="field-base" placeholder="MM/YY" />
            </div>
          </div>
        )}
      </fieldset>

      {/* Section 9: Gift deposit account */}
      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">사은품 입금계좌</legend>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="accent-brand-orange"
            checked={giftSameAsPayment}
            onChange={(e) => setGiftSameAsPayment(e.target.checked)}
          />
          납부계좌 정보와 동일
        </label>

        {!giftSameAsPayment && (
          <div className="grid gap-4 rounded-xl border border-brand-border bg-brand-surface p-4 md:grid-cols-2">
            <div>
              <label className="field-label">은행명</label>
              <select name="gift_bank_name" className="field-base" defaultValue="">
                <option value="">선택해주세요</option>
                {bankOptions.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">계좌번호</label>
              <input name="gift_account_number" className="field-base" placeholder="계좌번호를 입력해주세요" />
            </div>
            <div>
              <label className="field-label">예금주</label>
              <input name="gift_account_holder" className="field-base" placeholder="예금주명" />
            </div>
          </div>
        )}
        <p className="text-xs text-brand-slate">* 신청자와 예금주가 동일해야 합니다</p>
      </fieldset>

      {/* Section 10: Install date */}
      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">설치 희망일</legend>
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm cursor-pointer hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
            <input
              type="radio"
              name="install_date_type"
              value="asap"
              defaultChecked
              className="accent-brand-orange"
              onChange={() => setInstallDateType("asap")}
            />
            빠른 시일 희망
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-brand-border px-4 py-2.5 text-sm cursor-pointer hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
            <input
              type="radio"
              name="install_date_type"
              value="custom"
              className="accent-brand-orange"
              onChange={() => setInstallDateType("custom")}
            />
            직접 선택
          </label>
        </div>
        {installDateType === "custom" && (
          <input
            type="date"
            name="install_date"
            className="field-base"
            min={new Date().toISOString().split("T")[0]}
          />
        )}
        <div>
          <label className="field-label">연락 희망 시간</label>
          <select className="field-base" {...register("contactTimePreference")}>
            <option value="">선택해주세요</option>
            <option value="morning">오전 (10시~12시)</option>
            <option value="afternoon">오후 (12시~17시)</option>
            <option value="evening">저녁 (17시~19시)</option>
          </select>
        </div>
      </fieldset>

      {/* Section 11: Source channel */}
      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">유입 경로</legend>
        <div className="flex flex-wrap gap-2">
          {sourceOptions.map((opt) => (
            <label key={opt} className="flex items-center gap-2 rounded-xl border border-brand-border px-3 py-2 text-sm cursor-pointer hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
              <input type="radio" name="source_channel" value={opt} className="accent-brand-orange" />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Section 12: Memo */}
      <fieldset className="surface-card space-y-4">
        <legend className="text-base font-bold text-brand-graphite">남기실 말씀</legend>
        <textarea name="memo" className="field-base min-h-28" placeholder="상담 시 꼭 확인하고 싶은 내용을 적어주세요." />
      </fieldset>

      {/* Section 13: Agreements */}
      <div className="surface-card space-y-3">
        <label className="flex items-start gap-3 rounded-xl border border-brand-border px-4 py-3 text-sm text-brand-slate cursor-pointer hover:border-brand-orange">
          <input type="checkbox" className="mt-1 accent-brand-orange" {...register("termsAgreed")} />
          <span>
            서비스 <Link href="/policy/terms" className="text-brand-orange underline" target="_blank">이용약관</Link>에 동의합니다.
          </span>
        </label>
        {errors.termsAgreed && <p className="field-error">{errors.termsAgreed.message}</p>}

        <label className="flex items-start gap-3 rounded-xl border border-brand-border px-4 py-3 text-sm text-brand-slate cursor-pointer hover:border-brand-orange">
          <input type="checkbox" className="mt-1 accent-brand-orange" {...register("privacyAgreed")} />
          <span>
            <Link href="/policy/privacy" className="text-brand-orange underline" target="_blank">개인정보 수집 및 이용</Link>에 동의합니다.
          </span>
        </label>
        {errors.privacyAgreed && <p className="field-error">{errors.privacyAgreed.message}</p>}
      </div>

      <input type="hidden" {...register("sourcePage")} value="/apply" />
      <input type="hidden" {...register("regionLabel")} />

      {/* Error message */}
      {message && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{message}</p>}

      {/* Submit */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-2xl bg-brand-orange px-6 py-4 text-base font-bold text-white hover:bg-brand-orange-dark disabled:opacity-50"
        >
          {isPending ? "접수 중..." : "가입 신청하기"}
        </button>
        <a
          href={SITE_PHONE}
          className="flex-1 rounded-2xl border border-brand-orange px-6 py-4 text-center text-base font-bold text-brand-orange hover:bg-orange-50"
        >
          전화 문의
        </a>
      </div>
    </form>
  );
}
