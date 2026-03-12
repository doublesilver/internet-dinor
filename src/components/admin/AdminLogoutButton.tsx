"use client";

import { useTransition } from "react";

export function AdminLogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="rounded-xl border border-brand-border bg-white px-4 py-3 text-sm font-medium text-brand-graphite"
      onClick={() =>
        startTransition(async () => {
          await fetch("/api/admin/logout", { method: "POST" });
          window.location.href = "/admin/login";
        })
      }
      disabled={isPending}
    >
      {isPending ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
