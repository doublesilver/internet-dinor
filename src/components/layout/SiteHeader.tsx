"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { publicNavigation, carrierNavigation } from "@/lib/constants/navigation";
import type { SiteSettings } from "@/types/domain";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm" role="banner">
      {/* Main nav bar */}
      <div className="border-b border-brand-border">
        <div className="container-page flex h-16 items-center justify-between gap-4 py-0">
          <Link
            href="/"
            aria-label="홈으로 이동"
          >
            <img src="/images/characters/logo-dino.png" alt="인터넷공룡" className="h-12 w-auto" />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <nav
              aria-label="메인 네비게이션"
              className="flex items-center gap-6 text-base font-black text-brand-slate"
            >
              {publicNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-brand-graphite"
                >
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
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Carrier sub-nav (desktop only) */}
      <div className="hidden border-b border-brand-border bg-brand-surface lg:block">
        <div className="container-page">
          <nav aria-label="통신사 네비게이션" className="flex h-11 items-center justify-center gap-6 text-base font-bold text-brand-slate">
            {carrierNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-brand-orange"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          aria-label="모바일 네비게이션"
          className="border-t border-brand-border bg-white px-4 pb-4 lg:hidden"
        >
          <div className="flex flex-col gap-1 pt-2">
            <a
              href={settings.phoneLink}
              className="flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-3 text-base font-bold text-white"
              onClick={() => setMenuOpen(false)}
            >
              📞 {settings.phoneLabel}
            </a>
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-sm font-medium text-brand-graphite hover:bg-brand-surface"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-brand-border pt-2">
              <p className="px-4 py-1 text-xs font-semibold text-brand-slate">통신사별 상품</p>
              {carrierNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-brand-graphite hover:bg-brand-surface"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
