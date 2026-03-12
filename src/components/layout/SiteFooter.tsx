import Link from "next/link";
import type { SiteSettings } from "@/types/domain";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-brand-border bg-brand-surface pb-20" role="contentinfo">
      <div className="container-page space-y-4 py-8 text-sm text-brand-slate">
        <nav aria-label="푸터 링크" className="flex flex-wrap gap-4 font-medium">
          <Link href="/policy/terms" className="hover:text-brand-graphite">이용약관</Link>
          <Link href="/policy/privacy" className="font-bold text-brand-graphite hover:text-brand-orange">개인정보처리방침</Link>
          <Link href="/board/notice" className="hover:text-brand-graphite">공지사항</Link>
        </nav>
        <div className="space-y-1 text-xs leading-5 text-brand-slate">
          <p>
            상호명: {settings.siteName} | 대표자: {settings.businessInfo.owner} | 사업자등록번호: {settings.businessInfo.businessNumber}
          </p>
          <p>
            주소: {settings.businessInfo.address} | 이메일: {settings.businessInfo.email}
          </p>
          {settings.footerNotice && <p className="mt-2">{settings.footerNotice}</p>}
        </div>
      </div>
    </footer>
  );
}
