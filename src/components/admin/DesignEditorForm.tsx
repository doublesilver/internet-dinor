"use client";

import { useState, useTransition } from "react";
import type { DesignSettings } from "@/types/domain";
import { Button } from "@/components/ui/Button";

const DEFAULT_DESIGN: DesignSettings = {
  hero_bgColor: "#4A86CF",
  hero_titleFontSize: "55px",
  hero_titleColor: "#ffffff",
  hero_subtitleFontSize: "18px",
  hero_subtitleColor: "rgba(255,255,255,0.85)",

  carrierProducts_bgColor: "#D6E4F5",
  carrierProducts_headingFontSize: "32px",
  carrierProducts_headingColor: "#4A86CF",

  benefits_bgColor: "#6EA8E0",
  benefits_headingFontSize: "32px",
  benefits_headingColor: "#ffffff",

  cta_bgColor: "#333333",
  cta_headingFontSize: "32px",
  cta_headingColor: "#ffffff",

  recent_headingFontSize: "32px",
  recent_headingColor: "#2C3E50",

  tips_bgColor: "#F5F8FC",
  tips_headingFontSize: "32px",
  tips_headingColor: "#2C3E50",

  button_fontSize: "14px",
  button_radius: "16px",
  button_primaryColor: "#4A86CF",
  button_primaryDarkColor: "#3A74B8",

  section_padding: "48px"
};

type Message = { type: "success" | "error"; text: string } | null;

function parsePxValue(value: string): number {
  return parseInt(value.replace("px", ""), 10) || 0;
}

function toPx(value: number): string {
  return `${value}px`;
}

function ColorField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex items-center gap-2">
        <div
          className="h-5 w-5 flex-shrink-0 rounded-full border border-gray-300"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          className="h-9 w-12 cursor-pointer rounded border border-gray-200 p-0.5"
          value={value.startsWith("rgba") ? "#ffffff" : value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          className="field-base font-mono"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={30}
        />
      </div>
    </div>
  );
}

function PxField({
  label,
  value,
  onChange,
  min,
  max
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="field-base"
          value={parsePxValue(value)}
          onChange={(e) => onChange(toPx(Number(e.target.value)))}
          min={min}
          max={max}
        />
        <span className="text-sm text-brand-slate">px</span>
      </div>
    </div>
  );
}

function SectionPanel({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="surface-card overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <p className="font-semibold text-brand-graphite">{title}</p>
          <p className="text-xs text-brand-slate">{description}</p>
        </div>
        <span className="flex-shrink-0 text-brand-slate">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4">
          <div className="grid gap-4 md:grid-cols-2">{children}</div>
        </div>
      )}
    </div>
  );
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
    <div className="space-y-4">
      {/* Live Preview */}
      <div
        className="surface-card overflow-hidden rounded-2xl"
        style={
          {
            "--preview-hero-bg": form.hero_bgColor,
            "--preview-hero-title-color": form.hero_titleColor,
            "--preview-hero-title-size": form.hero_titleFontSize,
            "--preview-carrier-bg": form.carrierProducts_bgColor,
            "--preview-carrier-heading-color": form.carrierProducts_headingColor,
            "--preview-carrier-heading-size": form.carrierProducts_headingFontSize,
            "--preview-benefits-bg": form.benefits_bgColor,
            "--preview-cta-bg": form.cta_bgColor,
            "--preview-cta-color": form.cta_headingColor,
            "--preview-recent-color": form.recent_headingColor,
            "--preview-tips-bg": form.tips_bgColor,
            "--preview-tips-color": form.tips_headingColor,
            "--preview-button-radius": form.button_radius,
            "--preview-button-font-size": form.button_fontSize,
            "--preview-section-padding": form.section_padding
          } as React.CSSProperties
        }
      >
        <p className="px-4 pt-4 text-xs font-semibold uppercase text-brand-slate">미리보기</p>

        {/* Hero preview */}
        <div
          className="p-6"
          style={{
            backgroundColor: form.hero_bgColor,
            paddingTop: form.section_padding,
            paddingBottom: form.section_padding
          }}
        >
          <h1
            className="font-black font-surround"
            style={{ fontSize: form.hero_titleFontSize, color: form.hero_titleColor }}
          >
            이번달 최대로 남김없이!
          </h1>
          <p
            className="mt-2"
            style={{ fontSize: form.hero_subtitleFontSize, color: form.hero_subtitleColor }}
          >
            전국 최대 사은품 지급하는 곳!
          </p>
          <button
            className="mt-4 font-bold"
            style={{
              backgroundColor: form.button_primaryDarkColor,
              color: "#ffffff",
              borderRadius: form.button_radius,
              fontSize: form.button_fontSize,
              padding: "10px 24px"
            }}
          >
            최대 지원금 확인
          </button>
        </div>

        {/* Carrier products preview */}
        <div className="p-6" style={{ backgroundColor: form.carrierProducts_bgColor }}>
          <h2
            className="font-black font-surround"
            style={{
              fontSize: form.carrierProducts_headingFontSize,
              color: form.carrierProducts_headingColor
            }}
          >
            각 통신사 대표 상품
          </h2>
        </div>

        {/* Benefits preview */}
        <div className="p-6" style={{ backgroundColor: form.benefits_bgColor }}>
          <h2
            className="font-black font-surround"
            style={{
              fontSize: form.benefits_headingFontSize,
              color: form.benefits_headingColor
            }}
          >
            혜택 구성별 최대 사은품
          </h2>
        </div>

        {/* CTA preview */}
        <div className="p-6 text-center" style={{ backgroundColor: form.cta_bgColor }}>
          <h2
            className="font-black font-surround"
            style={{ fontSize: form.cta_headingFontSize, color: form.cta_headingColor }}
          >
            혜택이 이렇게나 많았다고?
          </h2>
          <button
            className="mt-4 font-bold border-2"
            style={{
              borderRadius: form.button_radius,
              fontSize: form.button_fontSize,
              color: form.cta_headingColor,
              borderColor: form.cta_headingColor,
              padding: "10px 24px"
            }}
          >
            전화 상담
          </button>
        </div>

        {/* Recent preview */}
        <div className="p-6">
          <h2
            className="font-black font-surround"
            style={{ fontSize: form.recent_headingFontSize, color: form.recent_headingColor }}
          >
            실시간 신청 현황
          </h2>
        </div>

        {/* Tips preview */}
        <div className="p-6" style={{ backgroundColor: form.tips_bgColor }}>
          <h2
            className="font-black font-surround"
            style={{ fontSize: form.tips_headingFontSize, color: form.tips_headingColor }}
          >
            꿀TIP 모아보기
          </h2>
        </div>
      </div>

      {/* 1. 히어로 섹션 */}
      <SectionPanel title="히어로 섹션" description="메인 상단 파란 배경 영역">
        <ColorField
          label="배경색"
          value={form.hero_bgColor}
          onChange={(v) => updateField("hero_bgColor", v)}
        />
        <PxField
          label="제목 크기"
          value={form.hero_titleFontSize}
          onChange={(v) => updateField("hero_titleFontSize", v)}
          min={20}
          max={120}
        />
        <ColorField
          label="제목 색상"
          value={form.hero_titleColor}
          onChange={(v) => updateField("hero_titleColor", v)}
        />
        <PxField
          label="부제목 크기"
          value={form.hero_subtitleFontSize}
          onChange={(v) => updateField("hero_subtitleFontSize", v)}
          min={12}
          max={40}
        />
        <ColorField
          label="부제목 색상"
          value={form.hero_subtitleColor}
          onChange={(v) => updateField("hero_subtitleColor", v)}
        />
      </SectionPanel>

      {/* 2. 통신사 대표 상품 섹션 */}
      <SectionPanel title="통신사 대표 상품 섹션" description="각 통신사 대표 상품 카드 영역">
        <ColorField
          label="배경색"
          value={form.carrierProducts_bgColor}
          onChange={(v) => updateField("carrierProducts_bgColor", v)}
        />
        <PxField
          label="제목 크기"
          value={form.carrierProducts_headingFontSize}
          onChange={(v) => updateField("carrierProducts_headingFontSize", v)}
          min={16}
          max={80}
        />
        <ColorField
          label="제목 색상"
          value={form.carrierProducts_headingColor}
          onChange={(v) => updateField("carrierProducts_headingColor", v)}
        />
      </SectionPanel>

      {/* 3. 혜택 구성별 섹션 */}
      <SectionPanel title="혜택 구성별 섹션" description="혜택 구성별 최대 사은품 카드 영역">
        <ColorField
          label="배경색"
          value={form.benefits_bgColor}
          onChange={(v) => updateField("benefits_bgColor", v)}
        />
        <PxField
          label="제목 크기"
          value={form.benefits_headingFontSize}
          onChange={(v) => updateField("benefits_headingFontSize", v)}
          min={16}
          max={80}
        />
        <ColorField
          label="제목 색상"
          value={form.benefits_headingColor}
          onChange={(v) => updateField("benefits_headingColor", v)}
        />
      </SectionPanel>

      {/* 4. CTA 배너 */}
      <SectionPanel title="CTA 배너" description='"혜택이 이렇게나 많았다고?" 어두운 배너 영역'>
        <ColorField
          label="배경색"
          value={form.cta_bgColor}
          onChange={(v) => updateField("cta_bgColor", v)}
        />
        <PxField
          label="제목 크기"
          value={form.cta_headingFontSize}
          onChange={(v) => updateField("cta_headingFontSize", v)}
          min={16}
          max={80}
        />
        <ColorField
          label="제목 색상"
          value={form.cta_headingColor}
          onChange={(v) => updateField("cta_headingColor", v)}
        />
      </SectionPanel>

      {/* 5. 실시간 신청 현황 */}
      <SectionPanel title="실시간 신청 현황" description="최근 신청 목록 섹션">
        <PxField
          label="제목 크기"
          value={form.recent_headingFontSize}
          onChange={(v) => updateField("recent_headingFontSize", v)}
          min={16}
          max={80}
        />
        <ColorField
          label="제목 색상"
          value={form.recent_headingColor}
          onChange={(v) => updateField("recent_headingColor", v)}
        />
      </SectionPanel>

      {/* 6. 꿀TIP 모아보기 */}
      <SectionPanel title="꿀TIP 모아보기" description="가이드/팁 카드 갤러리 섹션">
        <ColorField
          label="배경색"
          value={form.tips_bgColor}
          onChange={(v) => updateField("tips_bgColor", v)}
        />
        <PxField
          label="제목 크기"
          value={form.tips_headingFontSize}
          onChange={(v) => updateField("tips_headingFontSize", v)}
          min={16}
          max={80}
        />
        <ColorField
          label="제목 색상"
          value={form.tips_headingColor}
          onChange={(v) => updateField("tips_headingColor", v)}
        />
      </SectionPanel>

      {/* 7. 버튼 스타일 */}
      <SectionPanel title="버튼 스타일" description="전체 CTA 버튼 공통 스타일">
        <PxField
          label="폰트 크기"
          value={form.button_fontSize}
          onChange={(v) => updateField("button_fontSize", v)}
          min={10}
          max={24}
        />
        <PxField
          label="모서리 둥글기"
          value={form.button_radius}
          onChange={(v) => updateField("button_radius", v)}
          min={0}
          max={50}
        />
        <ColorField
          label="기본 색상"
          value={form.button_primaryColor}
          onChange={(v) => updateField("button_primaryColor", v)}
        />
        <ColorField
          label="호버 색상 (어두운)"
          value={form.button_primaryDarkColor}
          onChange={(v) => updateField("button_primaryDarkColor", v)}
        />
      </SectionPanel>

      {/* 8. 공통 */}
      <SectionPanel title="공통" description="섹션 간격 등 전체 공통 설정">
        <PxField
          label="섹션 상하 여백"
          value={form.section_padding}
          onChange={(v) => updateField("section_padding", v)}
          min={16}
          max={120}
        />
      </SectionPanel>

      {message ? (
        <p className={`text-sm ${message.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
          {message.text}
        </p>
      ) : null}
      <Button type="button" onClick={handleSave} disabled={isPending}>
        {isPending ? "저장 중..." : "디자인 설정 저장"}
      </Button>
    </div>
  );
}
