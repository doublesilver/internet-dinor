"use client";

import { useState, useTransition } from "react";
import type { Carrier, CarrierPriceData } from "@/types/domain";
import { Button } from "@/components/ui/Button";
import { getCarrierTheme } from "@/lib/constants/carriers";
import { PriceDataEditor } from "@/components/admin/PriceDataEditor";
import { DEFAULT_CARRIER_PRICE_DATA } from "@/components/sections/price-calculator/priceData";

type Message = { type: "success" | "error"; text: string } | null;

const EMPTY_PRICE_DATA: CarrierPriceData = {
  internetOptions: [],
  tvOptions: [],
  mobileOptions: []
};

export function CarrierEditorForm({ carrier }: { carrier: Carrier }) {
  const [form, setForm] = useState({
    name: carrier.name,
    shortName: carrier.shortName,
    slug: carrier.slug,
    summary: carrier.summary,
    heroTitle: carrier.heroTitle,
    heroDescription: carrier.heroDescription,
    featurePointsText: carrier.featurePoints.join("\n"),
    status: carrier.status,
    sortOrder: String(carrier.sortOrder)
  });
  const [priceData, setPriceData] = useState<CarrierPriceData>(
    carrier.priceData ?? DEFAULT_CARRIER_PRICE_DATA[carrier.slug] ?? EMPTY_PRICE_DATA
  );
  const [message, setMessage] = useState<Message>(null);
  const [isPending, startTransition] = useTransition();

  const theme = getCarrierTheme(carrier.slug);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    setMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/carriers/${carrier.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            sortOrder: Number(form.sortOrder),
            priceData: priceData.internetOptions.length > 0 ? priceData : undefined
          })
        });

        const result = (await response.json()) as { success: boolean; message?: string; warning?: string };
        if (!response.ok || !result.success) {
          setMessage({ type: "error", text: result.message ?? "통신사 저장에 실패했습니다." });
          return;
        }

        if (result.warning) {
          setMessage({ type: "error", text: result.warning });
        } else {
          setMessage({ type: "success", text: "저장되었습니다." });
        }
      } catch {
        setMessage({ type: "error", text: "저장 중 오류가 발생했습니다." });
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* ━━ 기본 정보 ━━ */}
      <fieldset className="surface-card space-y-4">
        <legend className="flex items-center gap-2 text-sm font-bold text-brand-graphite">
          <span className="inline-block h-4 w-1 rounded-full bg-brand-blue" />
          기본 정보
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="field-label">통신사명</label>
            <input className="field-base" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
          </div>
          <div>
            <label className="field-label">약칭 <span className="font-normal text-brand-slate">(짧은 이름, 예: SK, KT, LG)</span></label>
            <input className="field-base" value={form.shortName} onChange={(event) => updateField("shortName", event.target.value)} />
          </div>
          <div>
            <label className="field-label">URL 주소명 <span className="font-normal text-brand-slate">(영문, 숫자, 하이픈만 가능)</span></label>
            <input className="field-base" value={form.slug} onChange={(event) => updateField("slug", event.target.value)} />
          </div>
          <div>
            <label className="field-label">정렬 순서 <span className="font-normal text-brand-slate">(숫자가 작을수록 위에 표시)</span></label>
            <input className="field-base" value={form.sortOrder} onChange={(event) => updateField("sortOrder", event.target.value)} />
          </div>
        </div>
        <div>
          <label className="field-label">요약 <span className="font-normal text-brand-slate">(목록 페이지에 보이는 짧은 설명)</span></label>
          <textarea className="field-base min-h-24" value={form.summary} onChange={(event) => updateField("summary", event.target.value)} />
        </div>
      </fieldset>

      {/* ━━ 상단 영역 ━━ */}
      <fieldset className="surface-card space-y-4">
        <legend className="flex items-center gap-2 text-sm font-bold text-brand-graphite">
          <span className="inline-block h-4 w-1 rounded-full" style={{ backgroundColor: theme.accentColor }} />
          통신사 페이지 상단
        </legend>
        <div>
          <label className="field-label">상단 제목 <span className="font-normal text-brand-slate">(통신사 페이지 상단 큰 문구)</span></label>
          <input className="field-base" value={form.heroTitle} onChange={(event) => updateField("heroTitle", event.target.value)} />
        </div>
        <div>
          <label className="field-label">상단 설명 <span className="font-normal text-brand-slate">(통신사 페이지 상단 설명 문구)</span></label>
          <textarea className="field-base min-h-24" value={form.heroDescription} onChange={(event) => updateField("heroDescription", event.target.value)} />
        </div>
        <div>
          <label className="field-label">특징 포인트 <span className="font-normal text-brand-slate">(한 줄에 하나씩 입력)</span></label>
          <textarea className="field-base min-h-24" value={form.featurePointsText} onChange={(event) => updateField("featurePointsText", event.target.value)} />
        </div>
      </fieldset>

      {/* ━━ 요금 계산기 ━━ */}
      <fieldset className="surface-card space-y-4">
        <legend className="flex items-center gap-2 text-sm font-bold text-brand-graphite">
          <span className="inline-block h-4 w-1 rounded-full bg-emerald-500" />
          요금 계산기 — 통신사 상세페이지
        </legend>
        <p className="text-xs text-brand-slate">
          통신사 상세페이지의 요금 계산기에 표시되는 인터넷/TV/결합할인 옵션을 관리합니다.
          오른쪽 미리보기에서 실제 계산기와 동일한 결과를 확인할 수 있습니다.
        </p>
        <PriceDataEditor priceData={priceData} accentColor={theme.accentColor} onChange={setPriceData} />
      </fieldset>

      {/* ━━ 노출 설정 ━━ */}
      <fieldset className="surface-card space-y-4">
        <legend className="flex items-center gap-2 text-sm font-bold text-brand-graphite">
          <span className="inline-block h-4 w-1 rounded-full bg-amber-500" />
          노출 설정
        </legend>
        <div>
          <label className="field-label">상태</label>
          <select className="field-base" value={form.status} onChange={(event) => updateField("status", event.target.value as typeof form.status)}>
            <option value="draft">임시저장</option>
            <option value="published">게시중</option>
          </select>
        </div>
      </fieldset>

      {/* ━━ 저장 ━━ */}
      <div className="surface-card">
        {message ? <p className={`mb-3 text-sm ${message.type === "success" ? "text-emerald-600" : "text-red-600"}`}>{message.text}</p> : null}
        <div className="flex flex-col gap-3 md:flex-row">
          <Button type="button" onClick={handleSave} disabled={isPending}>
            {isPending ? "저장 중..." : "저장하기"}
          </Button>
          <Button href="/admin/carriers" variant="secondary">
            목록으로
          </Button>
        </div>
      </div>
    </div>
  );
}
