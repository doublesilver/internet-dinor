"use client";

import Link from "next/link";
import type { SiteSettings } from "@/types/domain";

const KAKAO_CHANNEL_CHAT = "https://pf.kakao.com/_yCxkxhX/chat";

export function FixedBottomBar({ settings }: { settings: SiteSettings }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand-border bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:hidden">
      <div className="flex items-stretch divide-x divide-brand-border">
        <a
          href={settings.phoneLink}
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-brand-orange hover:bg-blue-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          <span className="text-xs font-bold text-brand-orange">전화상담</span>
        </a>
        <a
          href={KAKAO_CHANNEL_CHAT}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[#3C1E1E] hover:bg-[#FEE500]/20"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#3C1E1E"><path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.86 5.22 4.65 6.6-.15.56-.96 3.53-1 3.67 0 .05.02.1.06.13a.12.12 0 0 0 .1.02c.14-.02 3.27-2.14 4.12-2.73.68.1 1.38.15 2.07.15 5.52 0 10-3.58 10-7.93S17.52 3 12 3z"/></svg>
          <span className="text-xs font-bold">카톡상담</span>
        </a>
        <Link
          href="/apply"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-brand-graphite hover:bg-brand-surface"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="13" y2="13"/></svg>
          <span className="text-xs font-bold">맞춤상담</span>
        </Link>
        <Link
          href="/apply"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-brand-orange hover:bg-blue-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span className="text-xs font-bold text-brand-orange">3초안내</span>
        </Link>
      </div>
    </div>
  );
}
