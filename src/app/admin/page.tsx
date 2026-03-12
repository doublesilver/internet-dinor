import type { Metadata } from "next";
import Link from "next/link";
import { getInquiryDashboardSummary } from "@/lib/repositories/inquiries";

export const metadata: Metadata = { title: "대시보드 - 관리자" };
import { getAdminSystemDiagnostics } from "@/lib/system/admin-system";

export default async function AdminDashboardPage() {
  const [summary, diagnostics] = await Promise.all([getInquiryDashboardSummary(), getAdminSystemDiagnostics()]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-brand-orange">Dashboard</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">운영 대시보드</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="surface-card">
          <p className="text-sm text-brand-slate">전체 문의</p>
          <p className="mt-3 text-3xl font-black text-brand-graphite">{summary.total}</p>
        </div>
        <div className="surface-card">
          <p className="text-sm text-brand-slate">오늘 문의</p>
          <p className="mt-3 text-3xl font-black text-brand-graphite">{summary.today}</p>
        </div>
        <div className="surface-card">
          <p className="text-sm text-brand-slate">신규</p>
          <p className="mt-3 text-3xl font-black text-brand-graphite">{summary.statusCount.new}</p>
        </div>
        <div className="surface-card">
          <p className="text-sm text-brand-slate">연락완료</p>
          <p className="mt-3 text-3xl font-black text-brand-graphite">{summary.statusCount.contacted}</p>
        </div>
      </div>
      <div className="surface-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-orange">System Snapshot</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-brand-graphite">운영 진단 요약</h2>
            <p className="mt-2 text-sm leading-6 text-brand-slate">
              인증 모드: {diagnostics.authMode === "supabase" ? "Supabase Auth" : "Preview Login"} / DB 상태:{" "}
              {diagnostics.databaseConnection.status === "ready"
                ? "정상"
                : diagnostics.databaseConnection.status === "warning"
                  ? "주의"
                  : "미연결"}
            </p>
          </div>
          <Link href="/admin/system" className="inline-flex rounded-2xl bg-brand-orange px-5 py-3 text-sm font-semibold text-white">
            운영 진단 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
