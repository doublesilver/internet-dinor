"use client";

import Link from "next/link";
import { useState } from "react";
import { publicNavigation } from "@/lib/constants/navigation";
import type { SiteSettings } from "@/types/domain";
import { Button } from "@/components/ui/Button";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-brand-border bg-white/90 backdrop-blur" role="banner">
      <div className="container-page flex items-center justify-between gap-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-brand-graphite" aria-label="홈으로 이동">
          {settings.siteName}
        </Link>

        <nav aria-label="메인 네비게이션" className="hidden items-center gap-6 text-sm font-medium text-brand-slate md:flex">
          {publicNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand-graphite">
              {item.label}
            </Link>
          ))}
        </nav>

        <Button href={settings.phoneLink} className="hidden md:inline-flex">
          {settings.secondaryCtaLabel}
        </Button>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl p-2 text-brand-graphite md:hidden"
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

      {menuOpen && (
        <nav aria-label="모바일 네비게이션" className="border-t border-brand-border bg-white px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-2">
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
            <div className="mt-2">
              <Button href={settings.phoneLink} fullWidth>
                {settings.secondaryCtaLabel}
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
