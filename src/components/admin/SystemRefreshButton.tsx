"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function SystemRefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="inline-flex rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-brand-graphite transition-colors hover:border-brand-orange hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-60"
      onClick={() =>
        startTransition(() => {
          router.refresh();
        })
      }
      disabled={isPending}
    >
      {isPending ? "재확인 중..." : "상태 다시 확인"}
    </button>
  );
}
