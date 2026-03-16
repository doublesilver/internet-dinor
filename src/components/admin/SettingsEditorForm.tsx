"use client";

import { useState, useTransition } from "react";
import type { SiteSettings } from "@/types/domain";
import { Button } from "@/components/ui/Button";

type Message = { type: "success" | "error"; text: string } | null;

export function SettingsEditorForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState({
    siteName: settings.siteName,
    phoneLabel: settings.phoneLabel,
    phoneLink: settings.phoneLink,
    heroCtaLabel: settings.heroCtaLabel,
    secondaryCtaLabel: settings.secondaryCtaLabel,
    footerNotice: settings.footerNotice,
    owner: settings.businessInfo.owner,
    businessNumber: settings.businessInfo.businessNumber,
    ecommerceNumber: settings.businessInfo.ecommerceNumber,
    address: settings.businessInfo.address,
    email: settings.businessInfo.email
  });
  const [message, setMessage] = useState<Message>(null);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    setMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });

        const result = (await response.json()) as { success: boolean; message?: string };
        if (!response.ok || !result.success) {
          setMessage({ type: "error", text: result.message ?? "설정 저장에 실패했습니다." });
          return;
        }

        setMessage({ type: "success", text: "저장되었습니다." });
      } catch {
        setMessage({ type: "error", text: "저장 중 오류가 발생했습니다." });
      }
    });
  }

  return (
    <div className="surface-card space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="field-label">사이트명</label>
          <input className="field-base" value={form.siteName} onChange={(event) => updateField("siteName", event.target.value)} />
        </div>
        <div>
          <label className="field-label">대표번호</label>
          <input className="field-base" value={form.phoneLabel} onChange={(event) => updateField("phoneLabel", event.target.value)} />
        </div>
        <div>
          <label className="field-label">전화 링크</label>
          <input className="field-base" value={form.phoneLink} onChange={(event) => updateField("phoneLink", event.target.value)} />
        </div>
        <div>
          <label className="field-label">메인 CTA</label>
          <input className="field-base" value={form.heroCtaLabel} onChange={(event) => updateField("heroCtaLabel", event.target.value)} />
        </div>
        <div>
          <label className="field-label">보조 CTA</label>
          <input className="field-base" value={form.secondaryCtaLabel} onChange={(event) => updateField("secondaryCtaLabel", event.target.value)} />
        </div>
        <div>
          <label className="field-label">대표자/상호명</label>
          <input className="field-base" value={form.owner} onChange={(event) => updateField("owner", event.target.value)} />
        </div>
        <div>
          <label className="field-label">사업자등록번호</label>
          <input className="field-base" value={form.businessNumber} onChange={(event) => updateField("businessNumber", event.target.value)} />
        </div>
        <div>
          <label className="field-label">통신판매업 신고번호</label>
          <input className="field-base" value={form.ecommerceNumber} onChange={(event) => updateField("ecommerceNumber", event.target.value)} />
        </div>
        <div>
          <label className="field-label">이메일</label>
          <input className="field-base" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
        </div>
      </div>
      <div>
        <label className="field-label">주소</label>
        <input className="field-base" value={form.address} onChange={(event) => updateField("address", event.target.value)} />
      </div>
      <div>
        <label className="field-label">푸터 문구</label>
        <textarea className="field-base min-h-24" value={form.footerNotice} onChange={(event) => updateField("footerNotice", event.target.value)} />
      </div>

      {message ? <p className={`text-sm ${message.type === "success" ? "text-emerald-600" : "text-red-600"}`}>{message.text}</p> : null}
      <Button type="button" onClick={handleSave} disabled={isPending}>
        {isPending ? "저장 중..." : "설정 저장"}
      </Button>
    </div>
  );
}
