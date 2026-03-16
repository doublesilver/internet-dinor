import Link from "next/link";
import type { SiteSettings } from "@/types/domain";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-brand-border bg-[#333] pb-20 text-white" role="contentinfo">
      {/* Contact CTA */}
      <div className="container-page space-y-4 py-16 text-center md:py-24">
        <p className="text-lg font-medium">지금 바로 전문 상담사에게 문의하세요</p>
        <a href={settings.phoneLink} className="mt-4 inline-block text-5xl font-black text-brand-orange md:text-6xl">
          {settings.phoneLabel}
        </a>
        <p className="mt-4 text-base text-white/70">평일 오전 10시 ~ 오후 7시 (주말/공휴일 휴무)</p>
        <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/apply" className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-orange px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-orange-dark">
            신청서 작성
          </Link>
          <a href={settings.phoneLink} className="inline-flex w-full items-center justify-center rounded-2xl border border-brand-orange bg-white px-6 py-3.5 text-sm font-bold text-brand-orange transition-colors hover:bg-blue-50">
            전화 상담
          </a>
        </div>
      </div>

      <div className="container-page space-y-6 py-10">
        {/* Title */}
        <p className="text-lg font-bold text-white">인터넷 가격비교</p>

        {/* Links */}
        <nav aria-label="푸터 링크" className="flex flex-wrap gap-4 text-base">
          <Link href="/policy/terms" className="rounded-full border border-white/30 px-5 py-1.5 text-sm hover:bg-white/10">이용약관</Link>
          <Link href="/policy/privacy" className="rounded-full border border-white/30 px-5 py-1.5 text-sm font-bold hover:bg-white/10">개인정보처리방침</Link>
        </nav>

        {/* Business info */}
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

        {/* Copyright */}
        <p className="border-t border-white/10 pt-4 text-xs text-white/40">
          Copyright {new Date().getFullYear()}. {settings.siteName} All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
