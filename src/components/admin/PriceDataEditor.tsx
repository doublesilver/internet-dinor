"use client";

import { useState } from "react";
import type { CarrierPriceData, CarrierInternetOption, CarrierTvOption, CarrierMobileOption } from "@/types/domain";
import { formatPrice } from "@/components/sections/price-calculator/priceData";

interface PriceDataEditorProps {
  priceData: CarrierPriceData;
  accentColor: string;
  onChange: (data: CarrierPriceData) => void;
}

const EMPTY_PRICE_DATA: CarrierPriceData = {
  internetOptions: [],
  tvOptions: [],
  mobileOptions: []
};

export function PriceDataEditor({ priceData, accentColor, onChange }: PriceDataEditorProps) {
  const data = priceData.internetOptions.length > 0 ? priceData : EMPTY_PRICE_DATA;

  // ── 인터넷 옵션 ──
  function addInternet() {
    onChange({
      ...data,
      internetOptions: [...data.internetOptions, { label: "", speed: "", price: 0 }]
    });
  }
  function updateInternet(index: number, field: keyof CarrierInternetOption, value: string | number) {
    const updated = [...data.internetOptions];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, internetOptions: updated });
  }
  function removeInternet(index: number) {
    onChange({ ...data, internetOptions: data.internetOptions.filter((_, i) => i !== index) });
  }

  // ── TV 옵션 ──
  function addTv() {
    onChange({
      ...data,
      tvOptions: [...data.tvOptions, { label: "", price: 0 }]
    });
  }
  function updateTv(index: number, field: keyof CarrierTvOption, value: string | number) {
    const updated = [...data.tvOptions];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, tvOptions: updated });
  }
  function removeTv(index: number) {
    onChange({ ...data, tvOptions: data.tvOptions.filter((_, i) => i !== index) });
  }

  // ── 모바일 옵션 ──
  function addMobile() {
    onChange({
      ...data,
      mobileOptions: [...data.mobileOptions, { label: "", discount: 0 }]
    });
  }
  function updateMobile(index: number, field: keyof CarrierMobileOption, value: string | number) {
    const updated = [...data.mobileOptions];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, mobileOptions: updated });
  }
  function removeMobile(index: number) {
    onChange({ ...data, mobileOptions: data.mobileOptions.filter((_, i) => i !== index) });
  }

  // ── 미리보기 계산 ──
  const [previewInternet, setPreviewInternet] = useState(0);
  const [previewTv, setPreviewTv] = useState(0);
  const [previewMobile, setPreviewMobile] = useState(0);

  const internetPrice = data.internetOptions[previewInternet]?.price ?? 0;
  const tvPrice = data.tvOptions[previewTv]?.price ?? 0;
  const mobileDiscount = data.mobileOptions[previewMobile]?.discount ?? 0;
  const totalPrice = Math.max(0, internetPrice + tvPrice + mobileDiscount);

  return (
    <div className="space-y-6">
      {/* ── 편집 영역: 실제 계산기와 동일한 3단 구성 ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">

          {/* 인터넷 속도 */}
          <div className="rounded-2xl border border-brand-border bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-brand-graphite">인터넷 속도</p>
              <button type="button" onClick={addInternet} className="rounded-lg px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: accentColor }}>
                + 추가
              </button>
            </div>
            {data.internetOptions.length === 0 && (
              <p className="py-4 text-center text-sm text-brand-slate">옵션을 추가하세요</p>
            )}
            <div className="space-y-2">
              {data.internetOptions.map((opt, i) => (
                <div key={`internet-${i}-${opt.label}`} className="flex items-center gap-2 rounded-xl bg-brand-surface p-3">
                  <div className="flex-1">
                    <label className="text-xs text-brand-slate">표시명</label>
                    <input className="field-base !py-1.5 text-sm" value={opt.label} onChange={(e) => updateInternet(i, "label", e.target.value)} placeholder="100M" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-brand-slate">속도</label>
                    <input className="field-base !py-1.5 text-sm" value={opt.speed} onChange={(e) => updateInternet(i, "speed", e.target.value)} placeholder="100M" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-brand-slate">월 요금 (원)</label>
                    <input className="field-base !py-1.5 text-sm" type="number" value={opt.price} onChange={(e) => updateInternet(i, "price", Number(e.target.value))} />
                  </div>
                  <button type="button" onClick={() => removeInternet(i)} className="mt-4 text-red-400 hover:text-red-600" title="삭제">
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TV 상품 */}
          <div className="rounded-2xl border border-brand-border bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-brand-graphite">TV 상품</p>
              <button type="button" onClick={addTv} className="rounded-lg px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: accentColor }}>
                + 추가
              </button>
            </div>
            {data.tvOptions.length === 0 && (
              <p className="py-4 text-center text-sm text-brand-slate">옵션을 추가하세요</p>
            )}
            <div className="space-y-2">
              {data.tvOptions.map((opt, i) => (
                <div key={`tv-${i}-${opt.label}`} className="flex items-center gap-2 rounded-xl bg-brand-surface p-3">
                  <div className="flex-1">
                    <label className="text-xs text-brand-slate">표시명</label>
                    <input className="field-base !py-1.5 text-sm" value={opt.label} onChange={(e) => updateTv(i, "label", e.target.value)} placeholder="스탠다드" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-brand-slate">월 요금 (원)</label>
                    <input className="field-base !py-1.5 text-sm" type="number" value={opt.price} onChange={(e) => updateTv(i, "price", Number(e.target.value))} />
                  </div>
                  <button type="button" onClick={() => removeTv(i)} className="mt-4 text-red-400 hover:text-red-600" title="삭제">
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 휴대폰 결합 */}
          <div className="rounded-2xl border border-brand-border bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-brand-graphite">휴대폰 결합 할인</p>
              <button type="button" onClick={addMobile} className="rounded-lg px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: accentColor }}>
                + 추가
              </button>
            </div>
            {data.mobileOptions.length === 0 && (
              <p className="py-4 text-center text-sm text-brand-slate">옵션을 추가하세요</p>
            )}
            <div className="space-y-2">
              {data.mobileOptions.map((opt, i) => (
                <div key={`mobile-${i}-${opt.label}`} className="flex items-center gap-2 rounded-xl bg-brand-surface p-3">
                  <div className="flex-1">
                    <label className="text-xs text-brand-slate">표시명</label>
                    <input className="field-base !py-1.5 text-sm" value={opt.label} onChange={(e) => updateMobile(i, "label", e.target.value)} placeholder="1회선" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-brand-slate">할인액 (원, 음수)</label>
                    <input className="field-base !py-1.5 text-sm" type="number" value={opt.discount} onChange={(e) => updateMobile(i, "discount", Number(e.target.value))} />
                  </div>
                  <button type="button" onClick={() => removeMobile(i)} className="mt-4 text-red-400 hover:text-red-600" title="삭제">
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 오른쪽: 실시간 계산기 미리보기 ── */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-slate">계산기 미리보기</p>

            <div className="overflow-hidden rounded-[20px] bg-white shadow-lg">
              <div className="space-y-4 p-4">
                {/* 인터넷 선택 */}
                <div className="space-y-2">
                  <p className="text-sm font-bold text-brand-graphite">인터넷 속도</p>
                  <div className="flex flex-wrap gap-2">
                    {data.internetOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPreviewInternet(i)}
                        className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                        style={i === previewInternet
                          ? { backgroundColor: accentColor, color: "#fff", border: `1px solid ${accentColor}` }
                          : { backgroundColor: "#fff", color: "#374151", border: "1px solid #e5e7eb" }
                        }
                      >
                        {opt.label || "..."}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TV 선택 */}
                <div className="space-y-2">
                  <p className="text-sm font-bold text-brand-graphite">TV 상품</p>
                  <div className="flex flex-wrap gap-2">
                    {data.tvOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPreviewTv(i)}
                        className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                        style={i === previewTv
                          ? { backgroundColor: accentColor, color: "#fff", border: `1px solid ${accentColor}` }
                          : { backgroundColor: "#fff", color: "#374151", border: "1px solid #e5e7eb" }
                        }
                      >
                        {opt.label || "..."}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 모바일 선택 */}
                <div className="space-y-2">
                  <p className="text-sm font-bold text-brand-graphite">휴대폰 결합</p>
                  <div className="flex flex-wrap gap-2">
                    {data.mobileOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPreviewMobile(i)}
                        className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                        style={i === previewMobile
                          ? { backgroundColor: accentColor, color: "#fff", border: `1px solid ${accentColor}` }
                          : { backgroundColor: "#fff", color: "#374151", border: "1px solid #e5e7eb" }
                        }
                      >
                        {opt.label || "..."}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 합계 */}
              <div className="border-t border-brand-border p-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-brand-surface p-2">
                    <p className="text-[10px] text-brand-slate">인터넷</p>
                    <p className="text-xs font-bold" style={{ color: accentColor }}>{formatPrice(internetPrice)}</p>
                  </div>
                  <div className="rounded-xl bg-brand-surface p-2">
                    <p className="text-[10px] text-brand-slate">TV</p>
                    <p className="text-xs font-bold" style={{ color: accentColor }}>{tvPrice > 0 ? `+${formatPrice(tvPrice)}` : "없음"}</p>
                  </div>
                  <div className="rounded-xl bg-brand-surface p-2">
                    <p className="text-[10px] text-brand-slate">결합할인</p>
                    <p className="text-xs font-bold" style={{ color: accentColor }}>{mobileDiscount < 0 ? `-${formatPrice(Math.abs(mobileDiscount))}` : "없음"}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 text-center" style={{ backgroundColor: accentColor }}>
                <p className="text-sm text-white/80">월 예상 요금</p>
                <p className="text-2xl font-black text-white">{formatPrice(totalPrice)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
