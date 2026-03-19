"use client";

import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/types/domain";

const KAKAO_CHANNEL_CHAT = "https://pf.kakao.com/_yCxkxhX/chat";

export function FloatingSidebar({ settings }: { settings: SiteSettings }) {
  return (
    <div className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 md:flex">
      {/* 비밀혜택 3초안내 */}
      <Link
        href="/apply"
        className="group flex flex-col items-center gap-1.5 rounded-xl bg-white px-3 py-3 text-brand-graphite shadow-lg ring-1 ring-gray-200 transition-transform hover:scale-105"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-orange">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="text-[11px] font-bold leading-tight text-center">비밀혜택<br />3초안내</span>
      </Link>

      {/* 실시간 카톡상담 */}
      <a
        href={KAKAO_CHANNEL_CHAT}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center gap-1.5 rounded-xl bg-[#FEE500] px-3 py-3 text-[#3C1E1E] shadow-lg transition-transform hover:scale-105"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#3C1E1E">
          <path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.86 5.22 4.65 6.6-.15.56-.96 3.53-1 3.67 0 .05.02.1.06.13a.12.12 0 0 0 .1.02c.14-.02 3.27-2.14 4.12-2.73.68.1 1.38.15 2.07.15 5.52 0 10-3.58 10-7.93S17.52 3 12 3z" />
        </svg>
        <span className="text-[11px] font-bold leading-tight text-center">실시간<br />카톡상담</span>
      </a>

      {/* 맞춤상담신청 */}
      <Link
        href="/apply"
        className="group flex flex-col items-center gap-1.5 rounded-xl bg-white px-3 py-3 text-brand-graphite shadow-lg ring-1 ring-gray-200 transition-transform hover:scale-105"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="9" y1="9" x2="15" y2="9" />
          <line x1="9" y1="13" x2="13" y2="13" />
        </svg>
        <span className="text-[11px] font-bold leading-tight text-center">맞춤<br />상담신청</span>
      </Link>

      {/* 대표번호 + 공룡 로고 */}
      <a
        href={settings.phoneLink}
        className="group flex flex-col items-center gap-1.5 rounded-xl bg-white px-3 py-3 text-brand-orange shadow-lg ring-1 ring-gray-200 transition-transform hover:scale-105"
      >
        <Image
          src="/images/characters/representative-dino.png"
          alt="인터넷공룡"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
        <span className="text-[10px] font-bold leading-tight text-center text-brand-graphite">{settings.phoneLabel}</span>
      </a>
    </div>
  );
}
