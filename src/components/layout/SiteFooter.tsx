import Link from "next/link";
import type { SiteSettings } from "@/types/domain";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-brand-border bg-[#333] pb-20 text-white" role="contentinfo">
      <div className="container-page py-8">
        {/* Two-column: left=info, right=CTA (mobile: stacked) */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Left: Business info */}
          <div className="space-y-5">
            <p className="text-lg font-bold text-white">인터넷 가격비교</p>

            <nav aria-label="푸터 링크" className="flex flex-wrap gap-4 text-base">
              <Link href="/policy/terms" className="rounded-full border border-white/30 px-5 py-1.5 text-sm hover:bg-white/10">이용약관</Link>
              <Link href="/policy/privacy" className="rounded-full border border-white/30 px-5 py-1.5 text-sm font-bold hover:bg-white/10">개인정보처리방침</Link>
            </nav>

            <address className="space-y-1.5 text-sm not-italic leading-relaxed text-white/60">
              <p className="font-semibold text-white/80">{settings.siteName}</p>
              <p>{settings.businessInfo.address}</p>
              <p>
                대표 : {settings.businessInfo.owner}{" "}
                사업자등록번호: {settings.businessInfo.businessNumber}{" "}
                <a href="/images/business-license.jpg" target="_blank" rel="noopener noreferrer" className="text-white/80 underline hover:text-white">[확인]</a>
              </p>
              <p>
                통신판매업 신고번호 : {settings.businessInfo.ecommerceNumber}{" "}
                <a href="/docs/ecommerce-license.pdf" target="_blank" rel="noopener noreferrer" className="text-white/80 underline hover:text-white">[확인]</a>
              </p>
              <p>개인정보보호책임자 : {settings.businessInfo.owner} ({settings.businessInfo.email})</p>
            </address>
          </div>

          {/* Right: Contact CTA */}
          <div className="shrink-0 space-y-3 text-center md:text-right">
            <img src="/images/characters/hero-dino.png" alt="" className="mx-auto h-[80px] w-auto md:ml-auto md:mr-0" />
            <p className="text-sm font-medium text-white/70">지금 바로 전문 상담사에게 문의하세요</p>
            <a href={settings.phoneLink} className="block text-4xl font-black text-brand-orange md:text-5xl">
              {settings.phoneLabel}
            </a>
            <p className="text-sm text-white/50">평일 오전 10시 ~ 오후 7시 (주말/공휴일 휴무)</p>
            <div className="flex flex-col gap-2 sm:flex-row md:justify-end">
              <Link href="/apply" className="inline-flex items-center justify-center rounded-2xl bg-brand-orange px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-orange-dark">
                신청서 작성
              </Link>
              <a href={settings.phoneLink} className="inline-flex items-center justify-center rounded-2xl border border-brand-orange bg-white px-5 py-3 text-sm font-bold text-brand-orange transition-colors hover:bg-blue-50">
                전화 상담
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-8 border-t border-white/10 pt-4 text-xs text-white/40">
          Copyright {new Date().getFullYear()}. {settings.siteName} All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
