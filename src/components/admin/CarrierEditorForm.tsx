"use client";

import { useState, useTransition } from "react";
import type { Carrier } from "@/types/domain";
import { Button } from "@/components/ui/Button";

type Message = { type: "success" | "error"; text: string } | null;

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
  const [message, setMessage] = useState<Message>(null);
  const [isPending, startTransition] = useTransition();

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
            sortOrder: Number(form.sortOrder)
          })
        });

        const result = (await response.json()) as { success: boolean; message?: string };
        if (!response.ok || !result.success) {
          setMessage({ type: "error", text: result.message ?? "통신사 저장에 실패했습니다." });
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
          <label className="field-label">통신사명</label>
          <input className="field-base" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
        </div>
        <div>
          <label className="field-label">약칭</label>
          <input className="field-base" value={form.shortName} onChange={(event) => updateField("shortName", event.target.value)} />
        </div>
        <div>
          <label className="field-label">슬러그</label>
          <input className="field-base" value={form.slug} onChange={(event) => updateField("slug", event.target.value)} />
        </div>
        <div>
          <label className="field-label">정렬순서</label>
          <input className="field-base" value={form.sortOrder} onChange={(event) => updateField("sortOrder", event.target.value)} />
        </div>
      </div>

      <div>
        <label className="field-label">요약</label>
        <textarea className="field-base min-h-24" value={form.summary} onChange={(event) => updateField("summary", event.target.value)} />
      </div>
      <div>
        <label className="field-label">히어로 제목</label>
        <input className="field-base" value={form.heroTitle} onChange={(event) => updateField("heroTitle", event.target.value)} />
      </div>
      <div>
        <label className="field-label">히어로 설명</label>
        <textarea className="field-base min-h-24" value={form.heroDescription} onChange={(event) => updateField("heroDescription", event.target.value)} />
      </div>
      <div>
        <label className="field-label">특징 포인트 (한 줄씩)</label>
        <textarea className="field-base min-h-24" value={form.featurePointsText} onChange={(event) => updateField("featurePointsText", event.target.value)} />
      </div>

      <div>
        <label className="field-label">상태</label>
        <select className="field-base" value={form.status} onChange={(event) => updateField("status", event.target.value as typeof form.status)}>
          <option value="draft">draft</option>
          <option value="published">published</option>
        </select>
      </div>

      {message ? <p className={`text-sm ${message.type === "success" ? "text-emerald-600" : "text-red-600"}`}>{message.text}</p> : null}
      <div className="flex flex-col gap-3 md:flex-row">
        <Button type="button" onClick={handleSave} disabled={isPending}>
          {isPending ? "저장 중..." : "통신사 저장"}
        </Button>
        <Button href="/admin/carriers" variant="secondary">
          목록으로
        </Button>
      </div>
    </div>
  );
}
