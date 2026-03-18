"use client";

import { useState, useTransition } from "react";
import type { Carrier, Product } from "@/types/domain";
import { Button } from "@/components/ui/Button";
import { getCarrierTheme } from "@/lib/constants/carriers";

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

  const selectedCarrier = carriers.find((c) => c.id === form.carrierId);
  const carrierSlug = selectedCarrier?.slug ?? "sk";
  const theme = getCarrierTheme(carrierSlug);

  return (
    <div className="space-y-6">
      {/* ── 미리보기 + 편집 2컬럼 레이아웃 ── */}
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        {/* ── 왼쪽: 편집 폼 (상세페이지 구조 순서) ── */}
        <div className="space-y-6">

          {/* ━━ 섹션 1: 기본 정보 ━━ */}
          <fieldset className="surface-card space-y-4">
            <legend className="flex items-center gap-2 text-sm font-bold text-brand-graphite">
              <span className="inline-block h-4 w-1 rounded-full bg-brand-blue" />
              기본 정보
            </legend>
            <div className="grid gap-4 md:grid-cols-2">
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
                <label className="field-label">상품명</label>
                <input className="field-base" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
              </div>
              <div>
                <label className="field-label">슬러그 (URL)</label>
                <input className="field-base" value={form.slug} onChange={(event) => updateField("slug", event.target.value)} />
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
                <label className="field-label">인터넷 속도</label>
                <input className="field-base" value={form.internetSpeed} onChange={(event) => updateField("internetSpeed", event.target.value)} placeholder="예: 100M, 500M, 1G" />
              </div>
              <div>
                <label className="field-label">정렬순서</label>
                <input className="field-base" type="number" value={form.sortOrder} onChange={(event) => updateField("sortOrder", event.target.value)} />
              </div>
            </div>
            <div>
              <label className="field-label">요약 (상품 카드에 표시)</label>
              <textarea className="field-base min-h-20" value={form.summary} onChange={(event) => updateField("summary", event.target.value)} placeholder="카드 제목 아래에 표시되는 짧은 설명" />
            </div>
            <div>
              <label className="field-label">상세 설명</label>
              <textarea className="field-base min-h-24" value={form.description} onChange={(event) => updateField("description", event.target.value)} />
            </div>
          </fieldset>

          {/* ━━ 섹션 2: 배지/태그 (카드 상단에 표시) ━━ */}
          <fieldset className="surface-card space-y-4">
            <legend className="flex items-center gap-2 text-sm font-bold text-brand-graphite">
              <span className="inline-block h-4 w-1 rounded-full" style={{ backgroundColor: theme.accentColor }} />
              배지 태그 — 상품 카드 상단
            </legend>
            <p className="text-xs text-brand-slate">카드 상단에 컬러 배지로 표시됩니다. 쉼표(,)로 구분하세요.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="field-label">배지 태그</label>
                <input className="field-base" value={form.badgeTagsText} onChange={(event) => updateField("badgeTagsText", event.target.value)} placeholder="예: 인기, 추천, 특가" />
              </div>
              <div>
                <label className="field-label">추천 대상 태그</label>
                <input className="field-base" value={form.targetTagsText} onChange={(event) => updateField("targetTagsText", event.target.value)} placeholder="예: 1인가구, 자취생" />
              </div>
            </div>
          </fieldset>

          {/* ━━ 섹션 3: 요금 표시 (카드 하단에 표시) ━━ */}
          <fieldset className="surface-card space-y-4">
            <legend className="flex items-center gap-2 text-sm font-bold text-brand-graphite">
              <span className="inline-block h-4 w-1 rounded-full bg-emerald-500" />
              요금 표시 — 상품 카드 하단
            </legend>
            <p className="text-xs text-brand-slate">상품 카드와 상세페이지에서 표시되는 가격 정보입니다.</p>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="field-label">월 요금 문구</label>
                <input className="field-base" value={form.monthlyPriceLabel} onChange={(event) => updateField("monthlyPriceLabel", event.target.value)} placeholder="예: 29,900원" />
              </div>
              <div>
                <label className="field-label">원가 문구 (취소선 표시)</label>
                <input className="field-base" value={form.originalPriceLabel} onChange={(event) => updateField("originalPriceLabel", event.target.value)} placeholder="예: 39,900원 (비워두면 미표시)" />
              </div>
              <div>
                <label className="field-label">혜택 문구</label>
                <input className="field-base" value={form.benefitLabel} onChange={(event) => updateField("benefitLabel", event.target.value)} placeholder="예: 3년 약정 특가" />
              </div>
            </div>
          </fieldset>

          {/* ━━ 섹션 4: 상세 콘텐츠 ━━ */}
          <fieldset className="surface-card space-y-4">
            <legend className="flex items-center gap-2 text-sm font-bold text-brand-graphite">
              <span className="inline-block h-4 w-1 rounded-full bg-violet-500" />
              상세 콘텐츠 — 상품 상세 페이지
            </legend>
            <div>
              <label className="field-label">핵심 포인트 (한 줄에 하나씩)</label>
              <textarea className="field-base min-h-24" value={form.heroPointsText} onChange={(event) => updateField("heroPointsText", event.target.value)} placeholder={"초고속 인터넷 1G\n프리미엄 와이파이 기본 제공\n약정 기간 내 요금 동결"} />
            </div>
            <div>
              <label className="field-label">상세 섹션 (제목::본문 — 한 줄에 하나씩)</label>
              <textarea className="field-base min-h-28" value={form.detailSectionsText} onChange={(event) => updateField("detailSectionsText", event.target.value)} placeholder="서비스 특징::초고속 광랜 기반의 안정적인 인터넷" />
            </div>
            <div>
              <label className="field-label">FAQ (질문::답변 — 한 줄에 하나씩)</label>
              <textarea className="field-base min-h-28" value={form.faqItemsText} onChange={(event) => updateField("faqItemsText", event.target.value)} placeholder="약정 기간은 얼마인가요?::3년 약정입니다." />
            </div>
          </fieldset>

          {/* ━━ 섹션 5: 노출 설정 ━━ */}
          <fieldset className="surface-card space-y-4">
            <legend className="flex items-center gap-2 text-sm font-bold text-brand-graphite">
              <span className="inline-block h-4 w-1 rounded-full bg-amber-500" />
              노출 설정
            </legend>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-lg border border-brand-border bg-brand-surface px-4 py-3 text-sm text-brand-graphite">
                <input type="checkbox" className="h-4 w-4" checked={form.tvIncluded} onChange={(event) => updateField("tvIncluded", event.target.checked)} />
                TV 포함
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-brand-border bg-brand-surface px-4 py-3 text-sm text-brand-graphite">
                <input type="checkbox" className="h-4 w-4" checked={form.isFeatured} onChange={(event) => updateField("isFeatured", event.target.checked)} />
                메인 대표 노출
              </label>
              <div>
                <label className="field-label">상태</label>
                <select className="field-base" value={form.status} onChange={(event) => updateField("status", event.target.value as typeof form.status)}>
                  <option value="draft">임시저장 (draft)</option>
                  <option value="published">공개 (published)</option>
                </select>
              </div>
            </div>
          </fieldset>

        </div>

        {/* ── 오른쪽: 실시간 미리보기 카드 ── */}
        <div className="hidden xl:block">
          <div className="sticky top-24 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-slate">미리보기</p>

            {/* 미니 상품 카드 미리보기 */}
            <div className="overflow-hidden rounded-[20px] border border-brand-border bg-white shadow-sm">
              <div className="px-6 pb-4 pt-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  {form.badgeTagsText
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tag) => (
                      <span key={tag} className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: theme.accentColor }}>
                        {tag}
                      </span>
                    ))}
                </div>
                <h3 className="text-lg font-black leading-snug text-brand-graphite">{form.name || "상품명"}</h3>
                <p className="mt-1 text-sm text-brand-slate">{form.summary || "요약 텍스트"}</p>
              </div>

              <div className="flex gap-3 px-6 pb-4">
                <span className="rounded-lg bg-brand-surface px-3 py-1.5 text-xs font-semibold text-brand-graphite">{form.internetSpeed || "속도"}</span>
                <span className="rounded-lg bg-brand-surface px-3 py-1.5 text-xs font-semibold text-brand-graphite">
                  {form.bundleType === "internet_only" ? "인터넷 단독" : form.bundleType === "internet_tv" ? "인터넷+TV" : form.bundleType === "business" ? "사업장용" : "기타"}
                </span>
              </div>

              <div className="border-t border-brand-border px-6 py-4">
                {form.originalPriceLabel && (
                  <p className="mb-1 text-sm text-brand-slate line-through">월 {form.originalPriceLabel}</p>
                )}
                <p className="text-sm text-brand-slate">
                  월{" "}
                  <strong className="text-2xl font-black" style={{ color: theme.accentColor }}>
                    {form.monthlyPriceLabel || "00,000원"}
                  </strong>
                </p>
                <p className="mt-0.5 text-xs text-brand-slate">3년 약정 기준</p>
              </div>

              <div className="flex border-t border-brand-border">
                <span className="flex-1 py-3.5 text-center text-sm font-bold text-white" style={{ backgroundColor: theme.accentColor }}>
                  빠른 견적
                </span>
                <span className="flex-1 border-l border-white/20 py-3.5 text-center text-sm font-bold text-white" style={{ backgroundColor: theme.accentColor, opacity: 0.85 }}>
                  신청서 작성
                </span>
              </div>
            </div>

            <p className="text-center text-xs text-brand-slate">* 실제 상세페이지에 표시되는 모습</p>
          </div>
        </div>
      </div>

      {/* ── 저장 버튼 (하단 고정) ── */}
      <div className="surface-card">
        {message ? <p className={`mb-3 text-sm ${message.type === "success" ? "text-emerald-600" : "text-red-600"}`}>{message.text}</p> : null}
        <div className="flex flex-col gap-3 md:flex-row">
          <Button type="button" onClick={handleSave} disabled={isPending}>
            {isPending ? "저장 중..." : mode === "create" ? "상품 생성" : "상품 저장"}
          </Button>
          <Button href="/admin/products" variant="secondary">
            목록으로
          </Button>
        </div>
      </div>
    </div>
  );
}
