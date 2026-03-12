import Link from "next/link";
import type { SiteSettings } from "@/types/domain";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-brand-border bg-brand-surface" role="contentinfo">
      <div className="container-page space-y-4 py-10 text-sm text-brand-slate">
        <nav aria-label="푸터 링크" className="flex flex-wrap gap-4">
          <Link href="/policy/terms">이용약관</Link>
          <Link href="/policy/privacy">개인정보처리방침</Link>
          <Link href="/board/notice">공지사항</Link>
        </nav>
        <p>{settings.footerNotice}</p>
        <div className="space-y-1">
          <p>상호명: {settings.siteName}</p>
          <p>대표자: {settings.businessInfo.owner}</p>
          <p>사업자등록번호: {settings.businessInfo.businessNumber}</p>
          <p>주소: {settings.businessInfo.address}</p>
          <p>이메일: {settings.businessInfo.email}</p>
        </div>
      </div>
    </footer>
  );
}
