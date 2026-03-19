"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/types/domain";

const KAKAO_CHANNEL_CHAT = "https://pf.kakao.com/_yCxkxhX/chat";

export function FloatingChatFab({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 md:hidden">
      {/* Expanded menu */}
      <div
        className={`flex flex-col gap-2 transition-all duration-200 ${open ? "visible translate-y-0 opacity-100" : "invisible translate-y-4 opacity-0"}`}
      >
        {/* 비밀혜택 3초안내 */}
        <Link
          href="/apply"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 rounded-full bg-brand-orange pl-4 pr-5 py-2.5 text-white shadow-lg transition-transform hover:scale-105"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-sm font-bold whitespace-nowrap">비밀혜택 3초안내</span>
        </Link>

        {/* 실시간 카톡상담 */}
        <a
          href={KAKAO_CHANNEL_CHAT}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 rounded-full bg-[#FEE500] pl-4 pr-5 py-2.5 text-[#3C1E1E] shadow-lg transition-transform hover:scale-105"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#3C1E1E">
            <path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.86 5.22 4.65 6.6-.15.56-.96 3.53-1 3.67 0 .05.02.1.06.13a.12.12 0 0 0 .1.02c.14-.02 3.27-2.14 4.12-2.73.68.1 1.38.15 2.07.15 5.52 0 10-3.58 10-7.93S17.52 3 12 3z" />
          </svg>
          <span className="text-sm font-bold whitespace-nowrap">실시간 카톡상담</span>
        </a>

        {/* 전화상담 */}
        <a
          href={settings.phoneLink}
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 rounded-full bg-white pl-4 pr-5 py-2.5 text-brand-graphite shadow-lg ring-1 ring-gray-200 transition-transform hover:scale-105"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-brand-orange">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          <span className="text-sm font-bold whitespace-nowrap">전화상담</span>
        </a>
      </div>

      {/* FAB button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "상담 메뉴 닫기" : "상담 메뉴 열기"}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-200 ${open ? "bg-gray-600 rotate-45" : "bg-brand-orange"}`}
      >
        {open ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
