"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/types/domain";

export function FixedBottomBar({ settings }: { settings: SiteSettings }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {expanded && (
        <div className="border-t border-brand-border bg-white px-4 py-3">
          <div className="container-page flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center rounded-2xl bg-brand-orange px-6 py-3 text-sm font-semibold text-white hover:bg-brand-orange-dark"
            >
              신청서 작성
            </Link>
            <a
              href={settings.phoneLink}
              className="inline-flex items-center justify-center rounded-2xl border border-brand-orange bg-white px-6 py-3 text-sm font-semibold text-brand-orange hover:bg-orange-50"
            >
              📞 전화 상담
            </a>
          </div>
        </div>
      )}
      <div className="border-t border-brand-border bg-brand-graphite">
        <div className="container-page flex items-center justify-between py-2">
          <a
            href={settings.phoneLink}
            className="text-lg font-black text-white tracking-wide"
          >
            {settings.phoneLabel}
          </a>
          <div className="flex items-center gap-3">
            <Link
              href="/apply"
              className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-dark"
            >
              빠른 견적
            </Link>
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="flex items-center justify-center rounded-xl bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label={expanded ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={expanded}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={`transition-transform ${expanded ? "rotate-180" : ""}`}
              >
                <polyline points="5 12 10 7 15 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
