"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { publicNavigation, carrierNavigation } from "@/lib/constants/navigation";
import type { SiteSettings } from "@/types/domain";

const menuIcons: Record<string, React.ReactNode> = {
  "신청서 작성": (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="13" y2="13" />
    </svg>
  ),
  "이벤트": (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8V5" /><path d="M7.5 5C7.5 5 9 4 12 5" /><path d="M16.5 5C16.5 5 15 4 12 5" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    </svg>
  ),
  "꿀TIP": (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  "후기": (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
};

const carrierLogos: Record<string, string> = {
  "/carriers/sk": "/images/carriers/sk_logo.png",
  "/carriers/kt": "/images/carriers/kt_logo.png",
  "/carriers/lg": "/images/carriers/lg_logo.png",
  "/carriers/skylife": "/images/carriers/kt_logo_sky.png",
  "/carriers/hellovision": "/images/carriers/lg_vision.png",
};

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white shadow-sm" role="banner">
        {/* Main nav bar */}
        <div className="border-b border-brand-border">
          <div className="container-page flex h-16 items-center justify-between gap-4 py-0">
            <Link href="/" aria-label="홈으로 이동">
              <span className="font-surround text-2xl font-black text-brand-orange lg:hidden">인터넷공룡</span>
              <span className="hidden lg:block lg:invisible lg:h-14 lg:w-[512px]" />
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              <nav
                aria-label="메인 네비게이션"
                className="flex items-center gap-6 text-lg font-black text-brand-slate"
              >
                {publicNavigation.map((item) => (
                  <Link key={item.href} href={item.href} className="hover:text-brand-graphite">
                    {item.label}
                  </Link>
                ))}
              </nav>

              <a
                href={settings.phoneLink}
                className="flex items-center gap-2 text-3xl font-black text-brand-orange"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                {settings.phoneLabel}
              </a>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2 text-brand-graphite lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="메뉴 열기"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carrier sub-nav (desktop only) */}
        <div className="hidden border-b border-brand-border bg-brand-surface lg:block">
          <div className="container-page">
            <nav aria-label="통신사 네비게이션" className="flex items-center justify-center gap-6 xl:gap-16 font-surround font-black" style={{ height: "var(--design-carrier-nav-height, 56px)", fontSize: "var(--design-carrier-nav-font-size, 24px)" }}>
              {carrierNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-4 py-2 text-brand-orange transition-colors"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = item.color; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = ""; }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile slide-in drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={close}
        />

        {/* Drawer panel */}
        <nav
          aria-label="모바일 네비게이션"
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex h-full flex-col overflow-y-auto">
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <span className="font-surround text-2xl font-black text-brand-orange">인터넷공룡</span>
              <button
                type="button"
                onClick={close}
                aria-label="메뉴 닫기"
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
            </div>

            {/* 추천 */}
            <div className="px-5 pt-5">
              <div className="flex items-center gap-3 pb-3">
                <span className="text-sm font-bold text-gray-700">추천</span>
                <span className="h-px flex-1 border-b border-dashed border-gray-300" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {publicNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 px-2 py-4 text-gray-500 hover:border-brand-orange hover:text-brand-orange"
                  >
                    {menuIcons[item.label] ?? (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /></svg>
                    )}
                    <span className="text-xs font-bold">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 인터넷 (통신사) */}
            <div className="px-5 pt-6">
              <div className="flex items-center gap-3 pb-3">
                <span className="text-sm font-bold text-gray-700">인터넷</span>
                <span className="h-px flex-1 border-b border-dashed border-gray-300" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {carrierNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-200 px-2 py-4 hover:border-gray-400"
                  >
                    {carrierLogos[item.href] ? (
                      <Image
                        src={carrierLogos[item.href]}
                        alt={item.label}
                        width={100}
                        height={32}
                        className="h-8 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-xs font-bold text-gray-600">{item.label}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* 전화 상담 */}
            <div className="mt-auto border-t border-gray-200 px-5 py-4">
              <a
                href={settings.phoneLink}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-3 text-base font-bold text-white"
                onClick={close}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                {settings.phoneLabel}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
