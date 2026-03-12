"use client";

import Link from "next/link";
import type { SiteSettings } from "@/types/domain";

export function FixedBottomBar({ settings }: { settings: SiteSettings }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand-border bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <div className="flex items-stretch divide-x divide-brand-border">
        <a
          href={settings.phoneLink}
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-brand-orange hover:bg-orange-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          <span className="text-xs font-bold text-brand-orange">전화상담</span>
        </a>
        <Link
          href="/apply"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-brand-graphite hover:bg-brand-surface"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span className="text-xs font-bold">신청서작성</span>
        </Link>
        <a
          href="#"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-brand-graphite hover:bg-brand-surface"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          <span className="text-xs font-bold">상품비교</span>
        </a>
        <Link
          href="/"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-brand-orange hover:bg-orange-50"
          onClick={(e) => {
            e.preventDefault();
            const hero = document.querySelector("section");
            hero?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          <span className="text-xs font-bold text-brand-orange">빠른견적</span>
        </Link>
      </div>
    </div>
  );
}
