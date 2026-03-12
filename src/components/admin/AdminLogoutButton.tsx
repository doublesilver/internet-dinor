"use client";

import { useState, useTransition } from "react";

export function AdminLogoutButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-1">
      <button
        type="button"
        className="rounded-xl border border-brand-border bg-white px-4 py-3 text-sm font-medium text-brand-graphite"
        onClick={() =>
          startTransition(async () => {
            try {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.href = "/admin/login";
            } catch {
              setMessage("로그아웃 중 오류가 발생했습니다.");
            }
          })
        }
        disabled={isPending}
      >
        {isPending ? "로그아웃 중..." : "로그아웃"}
      </button>
      {message ? <p className="text-xs text-red-600">{message}</p> : null}
    </div>
  );
}
