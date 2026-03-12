import Link from "next/link";
import type { SiteSettings } from "@/types/domain";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-brand-border bg-[#333] pb-20 text-white" role="contentinfo">
      <div className="container-page space-y-6 py-10">
        {/* Phone number - reference: 4rem bold orange */}
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <a href={settings.phoneLink} className="text-4xl font-black text-brand-orange">
              {settings.phoneLabel}
            </a>
            <span className="ml-4 text-base text-white/80">평일 오전 10시 ~ 오후 7시 (토요일 및 공휴일 제외)</span>
          </div>
        </div>

        {/* Links */}
        <nav aria-label="푸터 링크" className="flex flex-wrap gap-4 text-base">
          <Link href="/policy/terms" className="rounded-full border border-white/30 px-5 py-1.5 text-sm hover:bg-white/10">이용약관</Link>
          <Link href="/policy/privacy" className="rounded-full border border-white/30 px-5 py-1.5 text-sm font-bold hover:bg-white/10">개인정보처리방침</Link>
        </nav>

        {/* Business info */}
        <address className="space-y-1 text-sm not-italic leading-relaxed text-white/60">
          <p>상호명: {settings.siteName} | 대표자: {settings.businessInfo.owner} | 사업자등록번호: {settings.businessInfo.businessNumber}</p>
          <p>주소: {settings.businessInfo.address} | 이메일: {settings.businessInfo.email}</p>
          <p>개인정보관리책임자: 대표자 (help@internetdinor.co.kr)</p>
          {settings.footerNotice && <p className="mt-3 text-xs text-white/40">{settings.footerNotice}</p>}
        </address>

        {/* Copyright */}
        <p className="border-t border-white/10 pt-4 text-xs text-white/40">
          © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
