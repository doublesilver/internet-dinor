"use client";

import { useState, useTransition } from "react";

export function DeleteEntityButton({ endpoint, redirectTo, label }: { endpoint: string; redirectTo: string; label: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(`${label}을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`);
    if (!confirmed) return;

    setMessage(null);

    startTransition(async () => {
      const response = await fetch(endpoint, { method: "DELETE" });
      const result = (await response.json()) as { success: boolean; message?: string };

      if (!response.ok || !result.success) {
        setMessage(result.message ?? "삭제에 실패했습니다.");
        return;
      }

      window.location.href = redirectTo;
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="inline-flex rounded-2xl border border-red-300 bg-white px-5 py-3 text-sm font-semibold text-red-600"
        onClick={handleDelete}
        disabled={isPending}
      >
        {isPending ? "삭제 중..." : `${label} 삭제`}
      </button>
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
    </div>
  );
}
