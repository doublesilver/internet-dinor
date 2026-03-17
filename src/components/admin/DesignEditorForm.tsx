"use client";

import { useState, useTransition } from "react";
import type { DesignSettings } from "@/types/domain";
import { Button } from "@/components/ui/Button";

const DEFAULT_DESIGN: DesignSettings = {
  heroFontSize: "55px",
  headingFontSize: "32px",
  bodyFontSize: "16px",
  buttonFontSize: "14px",
  buttonRadius: "16px",
  sectionPadding: "48px",
  primaryColor: "#4A86CF",
  primaryDarkColor: "#3A74B8",
  heroBgColor: "#4A86CF",
  sectionBgColor: "#D6E4F5",
  ctaBgColor: "#333333"
};

type Message = { type: "success" | "error"; text: string } | null;

function parsePxValue(value: string): number {
  return parseInt(value.replace("px", ""), 10) || 0;
}

function toPx(value: number): string {
  return `${value}px`;
}

export function DesignEditorForm({ designSettings }: { designSettings?: DesignSettings }) {
  const [form, setForm] = useState<DesignSettings>({ ...DEFAULT_DESIGN, ...designSettings });
  const [message, setMessage] = useState<Message>(null);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof DesignSettings>(key: K, value: DesignSettings[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    setMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ designSettings: form })
        });

        const result = (await response.json()) as { success: boolean; message?: string };
        if (!response.ok || !result.success) {
          setMessage({ type: "error", text: result.message ?? "저장에 실패했습니다." });
          return;
        }

        setMessage({ type: "success", text: "디자인 설정이 저장되었습니다." });
      } catch {
        setMessage({ type: "error", text: "저장 중 오류가 발생했습니다." });
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* Live Preview */}
      <div
        className="surface-card overflow-hidden rounded-2xl"
        style={{
          "--preview-hero-bg": form.heroBgColor,
          "--preview-section-bg": form.sectionBgColor,
          "--preview-cta-bg": form.ctaBgColor,
          "--preview-primary": form.primaryColor,
          "--preview-button-radius": form.buttonRadius,
          "--preview-button-font-size": form.buttonFontSize,
          "--preview-hero-font-size": form.heroFontSize,
          "--preview-heading-font-size": form.headingFontSize,
          "--preview-body-font-size": form.bodyFontSize,
          "--preview-section-padding": form.sectionPadding
        } as React.CSSProperties}
      >
        <p className="px-4 pt-4 text-xs font-semibold uppercase text-brand-slate">미리보기</p>
        {/* Hero preview */}
        <div
          className="p-6"
          style={{ backgroundColor: form.heroBgColor, paddingTop: form.sectionPadding, paddingBottom: form.sectionPadding }}
        >
          <h1 className="font-black font-surround text-white" style={{ fontSize: form.heroFontSize }}>
            이번달 최대로 남김없이!
          </h1>
          <p className="mt-2 text-white/80" style={{ fontSize: form.bodyFontSize }}>
            전국 최대 사은품 지급하는 곳!
          </p>
          <button
            className="mt-4 font-bold text-white"
            style={{
              backgroundColor: form.primaryDarkColor,
              borderRadius: form.buttonRadius,
              fontSize: form.buttonFontSize,
              padding: "10px 24px"
            }}
          >
            최대 지원금 확인
          </button>
        </div>
        {/* Section heading preview */}
        <div className="p-6" style={{ backgroundColor: form.sectionBgColor }}>
          <h2 className="font-black font-surround" style={{ fontSize: form.headingFontSize, color: form.primaryColor }}>
            각 통신사 대표 상품
          </h2>
          <p className="mt-1 text-gray-600" style={{ fontSize: form.bodyFontSize }}>
            섹션 본문 텍스트 예시입니다.
          </p>
        </div>
        {/* CTA preview */}
        <div className="p-6 text-center" style={{ backgroundColor: form.ctaBgColor }}>
          <h2 className="font-black font-surround text-white" style={{ fontSize: form.headingFontSize }}>
            혜택이 이렇게나 많았다고?
          </h2>
          <button
            className="mt-4 font-bold text-white border-2 border-white"
            style={{
              borderRadius: form.buttonRadius,
              fontSize: form.buttonFontSize,
              padding: "10px 24px"
            }}
          >
            전화 상담
          </button>
        </div>
      </div>

      {/* Typography */}
      <div className="surface-card space-y-4">
        <h2 className="text-lg font-bold text-brand-graphite">타이포그래피</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="field-label">히어로 폰트 크기</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="field-base"
                value={parsePxValue(form.heroFontSize)}
                onChange={(e) => updateField("heroFontSize", toPx(Number(e.target.value)))}
                min={20}
                max={120}
              />
              <span className="text-sm text-brand-slate">px</span>
            </div>
          </div>
          <div>
            <label className="field-label">섹션 제목 폰트 크기</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="field-base"
                value={parsePxValue(form.headingFontSize)}
                onChange={(e) => updateField("headingFontSize", toPx(Number(e.target.value)))}
                min={16}
                max={80}
              />
              <span className="text-sm text-brand-slate">px</span>
            </div>
          </div>
          <div>
            <label className="field-label">본문 폰트 크기</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="field-base"
                value={parsePxValue(form.bodyFontSize)}
                onChange={(e) => updateField("bodyFontSize", toPx(Number(e.target.value)))}
                min={12}
                max={24}
              />
              <span className="text-sm text-brand-slate">px</span>
            </div>
          </div>
          <div>
            <label className="field-label">버튼 폰트 크기</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="field-base"
                value={parsePxValue(form.buttonFontSize)}
                onChange={(e) => updateField("buttonFontSize", toPx(Number(e.target.value)))}
                min={10}
                max={24}
              />
              <span className="text-sm text-brand-slate">px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="surface-card space-y-4">
        <h2 className="text-lg font-bold text-brand-graphite">색상</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(
            [
              { key: "primaryColor", label: "기본 컬러" },
              { key: "primaryDarkColor", label: "기본 컬러 (어두운)" },
              { key: "heroBgColor", label: "히어로 배경색" },
              { key: "sectionBgColor", label: "섹션 배경색" },
              { key: "ctaBgColor", label: "CTA 배경색" }
            ] as Array<{ key: keyof DesignSettings; label: string }>
          ).map(({ key, label }) => (
            <div key={key}>
              <label className="field-label">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-12 cursor-pointer rounded border border-gray-200 p-0.5"
                  value={form[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                />
                <input
                  type="text"
                  className="field-base font-mono uppercase"
                  value={form[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                  maxLength={7}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="surface-card space-y-4">
        <h2 className="text-lg font-bold text-brand-graphite">레이아웃</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="field-label">버튼 모서리 반경</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="field-base"
                value={parsePxValue(form.buttonRadius)}
                onChange={(e) => updateField("buttonRadius", toPx(Number(e.target.value)))}
                min={0}
                max={50}
              />
              <span className="text-sm text-brand-slate">px</span>
            </div>
          </div>
          <div>
            <label className="field-label">섹션 상하 여백</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="field-base"
                value={parsePxValue(form.sectionPadding)}
                onChange={(e) => updateField("sectionPadding", toPx(Number(e.target.value)))}
                min={16}
                max={120}
              />
              <span className="text-sm text-brand-slate">px</span>
            </div>
          </div>
        </div>
      </div>

      {message ? <p className={`text-sm ${message.type === "success" ? "text-emerald-600" : "text-red-600"}`}>{message.text}</p> : null}
      <Button type="button" onClick={handleSave} disabled={isPending}>
        {isPending ? "저장 중..." : "디자인 설정 저장"}
      </Button>
    </div>
  );
}
