"use client";

import { useState, useTransition } from "react";
import type { Carrier, Product } from "@/types/domain";
import { Button } from "@/components/ui/Button";

type Message = { type: "success" | "error"; text: string } | null;

export function ProductEditorForm({
  product,
  carriers,
  mode = "edit"
}: {
  product: Product;
  carriers: Carrier[];
  mode?: "create" | "edit";
}) {
  const [form, setForm] = useState({
    name: product.name,
    slug: product.slug,
    summary: product.summary,
    description: product.description,
    carrierId: product.carrierId,
    bundleType: product.bundleType,
    internetSpeed: product.internetSpeed,
    monthlyPriceLabel: product.monthlyPriceLabel,
    originalPriceLabel: product.originalPriceLabel ?? "",
    benefitLabel: product.benefitLabel,
    badgeTagsText: product.badgeTags.join(", "),
    targetTagsText: product.targetTags.join(", "),
    heroPointsText: product.heroPoints.join("\n"),
    detailSectionsText: product.detailSections.map((item) => `${item.title}::${item.body}`).join("\n"),
    faqItemsText: product.faqItems.map((item) => `${item.q}::${item.a}`).join("\n"),
    tvIncluded: product.tvIncluded,
    isFeatured: product.isFeatured,
    status: product.status,
    sortOrder: String(product.sortOrder)
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
        const response = await fetch(mode === "create" ? "/api/admin/products" : `/api/admin/products/${product.id}`, {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            sortOrder: Number(form.sortOrder)
          })
        });

        const result = (await response.json()) as { success: boolean; message?: string; data?: { id?: string } };
        if (!response.ok || !result.success) {
          setMessage({ type: "error", text: result.message ?? "상품 저장에 실패했습니다." });
          return;
        }

        if (mode === "create" && result.data?.id) {
          window.location.href = `/admin/products/${result.data.id}`;
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
          <label className="field-label">상품명</label>
          <input className="field-base" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
        </div>
        <div>
          <label className="field-label">슬러그</label>
          <input className="field-base" value={form.slug} onChange={(event) => updateField("slug", event.target.value)} />
        </div>
        <div>
          <label className="field-label">통신사</label>
          <select className="field-base" value={form.carrierId} onChange={(event) => updateField("carrierId", event.target.value)}>
            {carriers.map((carrier) => (
              <option key={carrier.id} value={carrier.id}>
                {carrier.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">구성</label>
          <select className="field-base" value={form.bundleType} onChange={(event) => updateField("bundleType", event.target.value as typeof form.bundleType)}>
            <option value="internet_only">인터넷 단독</option>
            <option value="internet_tv">인터넷 + TV</option>
            <option value="business">사업장용</option>
            <option value="custom">기타</option>
          </select>
        </div>
        <div>
          <label className="field-label">속도</label>
          <input className="field-base" value={form.internetSpeed} onChange={(event) => updateField("internetSpeed", event.target.value)} />
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
        <label className="field-label">상세 설명</label>
        <textarea className="field-base min-h-28" value={form.description} onChange={(event) => updateField("description", event.target.value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="field-label">월 요금 문구</label>
          <input className="field-base" value={form.monthlyPriceLabel} onChange={(event) => updateField("monthlyPriceLabel", event.target.value)} />
        </div>
        <div>
          <label className="field-label">원가 문구</label>
          <input className="field-base" value={form.originalPriceLabel} onChange={(event) => updateField("originalPriceLabel", event.target.value)} />
        </div>
        <div>
          <label className="field-label">혜택 문구</label>
          <input className="field-base" value={form.benefitLabel} onChange={(event) => updateField("benefitLabel", event.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="field-label">배지 태그</label>
          <input className="field-base" value={form.badgeTagsText} onChange={(event) => updateField("badgeTagsText", event.target.value)} />
        </div>
        <div>
          <label className="field-label">추천 대상 태그</label>
          <input className="field-base" value={form.targetTagsText} onChange={(event) => updateField("targetTagsText", event.target.value)} />
        </div>
      </div>

      <div>
        <label className="field-label">상단 핵심 포인트</label>
        <textarea className="field-base min-h-24" value={form.heroPointsText} onChange={(event) => updateField("heroPointsText", event.target.value)} />
      </div>
      <div>
        <label className="field-label">상세 섹션 (`제목::본문` 한 줄씩)</label>
        <textarea className="field-base min-h-28" value={form.detailSectionsText} onChange={(event) => updateField("detailSectionsText", event.target.value)} />
      </div>
      <div>
        <label className="field-label">FAQ (`질문::답변` 한 줄씩)</label>
        <textarea className="field-base min-h-28" value={form.faqItemsText} onChange={(event) => updateField("faqItemsText", event.target.value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex items-center gap-3 text-sm text-brand-graphite">
          <input type="checkbox" checked={form.tvIncluded} onChange={(event) => updateField("tvIncluded", event.target.checked)} />
          TV 포함
        </label>
        <label className="flex items-center gap-3 text-sm text-brand-graphite">
          <input type="checkbox" checked={form.isFeatured} onChange={(event) => updateField("isFeatured", event.target.checked)} />
          대표 노출
        </label>
        <div>
          <label className="field-label">상태</label>
          <select className="field-base" value={form.status} onChange={(event) => updateField("status", event.target.value as typeof form.status)}>
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </div>
      </div>

      {message ? <p className={`text-sm ${message.type === "success" ? "text-emerald-600" : "text-red-600"}`}>{message.text}</p> : null}
      <div className="flex flex-col gap-3 md:flex-row">
        <Button type="button" onClick={handleSave} disabled={isPending}>
          {isPending ? "저장 중..." : mode === "create" ? "상품 생성" : "상품 저장"}
        </Button>
        <Button href="/admin/products" variant="secondary">
          목록으로
        </Button>
      </div>
    </div>
  );
}
