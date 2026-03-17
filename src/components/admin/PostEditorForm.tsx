"use client";

import { useState, useTransition } from "react";
import type { Post, Review } from "@/types/domain";
import { Button } from "@/components/ui/Button";

type ContentEntity =
  | { entityType: "post"; entity: Post }
  | { entityType: "review"; entity: Review };

type Message = { type: "success" | "error"; text: string } | null;

export function PostEditorForm({ content, mode = "edit" }: { content: ContentEntity; mode?: "create" | "edit" }) {
  const isReview = content.entityType === "review";
  const entity = content.entity;
  const postEntity = content.entityType === "post" ? content.entity : null;
  const reviewEntity = content.entityType === "review" ? content.entity : null;

  const [form, setForm] = useState({
    entityType: content.entityType,
    type: postEntity?.type ?? "guide",
    reviewType: reviewEntity?.reviewType ?? "internet_tv",
    title: entity.title,
    slug: entity.slug,
    summary: entity.summary,
    body: entity.body,
    ctaLabel: postEntity?.ctaLabel ?? "",
    relatedProductSlugsText: postEntity?.relatedProductSlugs.join(", ") ?? "",
    tagsText: reviewEntity?.tags.join(", ") ?? "",
    isFeatured: reviewEntity?.featured ?? postEntity?.isFeatured ?? false,
    status: entity.status,
    publishedAt: entity.publishedAt.slice(0, 16)
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
        const response = await fetch(mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${entity.id}`, {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            publishedAt: new Date(form.publishedAt).toISOString()
          })
        });

        const result = (await response.json()) as { success: boolean; message?: string; data?: { id?: string } };
        if (!response.ok || !result.success) {
          setMessage({ type: "error", text: result.message ?? "저장에 실패했습니다." });
          return;
        }

        if (mode === "create" && result.data?.id) {
          window.location.href = `/admin/posts/${result.data.id}`;
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
          <label className="field-label">제목</label>
          <input className="field-base" value={form.title} onChange={(event) => updateField("title", event.target.value)} />
        </div>
        <div>
          <label className="field-label">URL 주소명 <span className="font-normal text-brand-slate">(영문, 숫자, 하이픈만 가능)</span></label>
          <input className="field-base" value={form.slug} onChange={(event) => updateField("slug", event.target.value)} />
        </div>
        {!isReview ? (
          <div>
            <label className="field-label">게시물 유형</label>
            <select className="field-base" value={form.type} onChange={(event) => updateField("type", event.target.value as typeof form.type)}>
              <option value="event">이벤트</option>
              <option value="guide">가이드</option>
              <option value="notice">공지사항</option>
            </select>
          </div>
        ) : (
          <div>
            <label className="field-label">후기 유형</label>
            <select className="field-base" value={form.reviewType} onChange={(event) => updateField("reviewType", event.target.value as typeof form.reviewType)}>
              <option value="internet_only">인터넷 단독</option>
              <option value="internet_tv">인터넷+TV</option>
              <option value="moving">이사</option>
              <option value="bundle">결합</option>
              <option value="renewal">재약정</option>
            </select>
          </div>
        )}
        <div>
          <label className="field-label">게시일</label>
          <input className="field-base" type="datetime-local" value={form.publishedAt} onChange={(event) => updateField("publishedAt", event.target.value)} />
        </div>
      </div>

      <div>
        <label className="field-label">요약 <span className="font-normal text-brand-slate">(목록 페이지에 보이는 짧은 설명)</span></label>
        <textarea className="field-base min-h-24" value={form.summary} onChange={(event) => updateField("summary", event.target.value)} />
      </div>

      <div>
        <label className="field-label">본문</label>
        <textarea className="field-base min-h-56" value={form.body} onChange={(event) => updateField("body", event.target.value)} />
      </div>

      {!isReview ? (
        <>
          <div>
            <label className="field-label">버튼 문구 <span className="font-normal text-brand-slate">(게시물 하단 클릭 유도 버튼)</span></label>
            <input className="field-base" value={form.ctaLabel} onChange={(event) => updateField("ctaLabel", event.target.value)} />
          </div>
          <div>
            <label className="field-label">연관 상품 URL명 <span className="font-normal text-brand-slate">(쉼표로 구분, 예: sk-internet-500, kt-giga)</span></label>
            <input className="field-base" value={form.relatedProductSlugsText} onChange={(event) => updateField("relatedProductSlugsText", event.target.value)} />
          </div>
        </>
      ) : (
        <div>
          <label className="field-label">태그 <span className="font-normal text-brand-slate">(쉼표로 구분, 예: SK브로드밴드, 인터넷+TV)</span></label>
          <input className="field-base" value={form.tagsText} onChange={(event) => updateField("tagsText", event.target.value)} />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-3 text-sm text-brand-graphite">
          <input type="checkbox" checked={form.isFeatured} onChange={(event) => updateField("isFeatured", event.target.checked)} />
          대표 노출
        </label>
        <div>
          <label className="field-label">상태</label>
          <select className="field-base" value={form.status} onChange={(event) => updateField("status", event.target.value as typeof form.status)}>
            <option value="draft">임시저장</option>
            <option value="published">게시중</option>
          </select>
        </div>
      </div>

      {message ? <p className={`text-sm ${message.type === "success" ? "text-emerald-600" : "text-red-600"}`}>{message.text}</p> : null}
      <div className="flex flex-col gap-3 md:flex-row">
        <Button type="button" onClick={handleSave} disabled={isPending}>
          {isPending ? "저장 중..." : mode === "create" ? "등록하기" : "저장하기"}
        </Button>
        <Button href="/admin/posts" variant="secondary">
          목록으로
        </Button>
      </div>
    </div>
  );
}
