"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ContentStatus } from "@/types/domain";

interface StatusQuickToggleProps {
  endpoint: string;
  initialStatus: ContentStatus;
  entityLabel: string;
  entityType?: "post" | "review";
}

function getStatusLabel(status: ContentStatus) {
  return status === "published" ? "게시중" : "임시저장";
}

function getStatusClassName(status: ContentStatus) {
  return status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600";
}

export function StatusQuickToggle({ endpoint, initialStatus, entityLabel, entityType }: StatusQuickToggleProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, startTransition] = useTransition();

  const isPending = isSaving || isRefreshing;
  const nextStatus: ContentStatus = status === "published" ? "draft" : "published";

  async function handleToggle() {
    setMessage(null);
    setIsSaving(true);

    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: nextStatus,
        ...(entityType ? { entityType } : {})
      })
    });

    const result = (await response.json()) as { success: boolean; message?: string };

    setIsSaving(false);

    if (!response.ok || !result.success) {
      setMessage(result.message ?? `${entityLabel} 상태 변경에 실패했습니다.`);
      return;
    }

    setStatus(nextStatus);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(status)}`}>{getStatusLabel(status)}</span>
        <button
          type="button"
          className="inline-flex rounded-2xl border border-brand-border bg-white px-4 py-2 text-xs font-semibold text-brand-graphite transition-colors hover:border-brand-orange hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleToggle}
          disabled={isPending}
        >
          {isPending ? "변경 중..." : status === "published" ? "임시저장으로 전환" : "게시중으로 전환"}
        </button>
      </div>
      {message ? <p className="text-xs text-red-600">{message}</p> : null}
    </div>
  );
}
