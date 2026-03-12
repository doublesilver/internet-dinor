"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-black text-brand-graphite">문제가 발생했습니다</h1>
      <p className="max-w-md text-brand-slate">페이지를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-2xl bg-brand-orange px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
      >
        다시 시도
      </button>
    </div>
  );
}
