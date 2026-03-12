import { SystemRefreshButton } from "@/components/admin/SystemRefreshButton";
import { getAdminSystemDiagnostics } from "@/lib/system/admin-system";

function getStatusClassName(status: "ready" | "warning" | "missing") {
  if (status === "ready") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "warning") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-slate-100 text-slate-600";
}

function getStatusLabel(status: "ready" | "warning" | "missing") {
  if (status === "ready") return "정상";
  if (status === "warning") return "주의";
  return "미설정";
}

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(iso));
}

export default async function AdminSystemPage() {
  const diagnostics = await getAdminSystemDiagnostics();
  const databaseCount = diagnostics.dataSummary.filter((item) => item.source === "database").length;
  const mockCount = diagnostics.dataSummary.filter((item) => item.source === "mock").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-orange">System</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">운영 진단</h1>
          <p className="mt-3 text-sm leading-6 text-brand-slate">외주 1차 제작물 기준으로 관리자 인증, Supabase 연결, 데이터 소스 상태를 한 화면에서 점검합니다.</p>
        </div>
        <SystemRefreshButton />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="surface-card">
          <p className="text-sm text-brand-slate">인증 모드</p>
          <p className="mt-3 text-2xl font-black text-brand-graphite">{diagnostics.authMode === "supabase" ? "Supabase Auth" : "Preview Login"}</p>
        </div>
        <div className="surface-card">
          <p className="text-sm text-brand-slate">DB 연결</p>
          <p className="mt-3 text-2xl font-black text-brand-graphite">{getStatusLabel(diagnostics.databaseConnection.status)}</p>
          <p className="mt-2 text-xs text-brand-slate">{diagnostics.databaseConnection.message}</p>
        </div>
        <div className="surface-card">
          <p className="text-sm text-brand-slate">데이터 소스</p>
          <p className="mt-3 text-2xl font-black text-brand-graphite">DB {databaseCount} / Mock {mockCount}</p>
          <p className="mt-2 text-xs text-brand-slate">각 영역이 현재 어느 데이터 소스로 읽히는지 요약합니다.</p>
        </div>
        <div className="surface-card">
          <p className="text-sm text-brand-slate">마지막 확인</p>
          <p className="mt-3 text-lg font-bold text-brand-graphite">{formatDateTime(diagnostics.generatedAt)}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {diagnostics.checks.map((check) => (
          <article key={check.id} className="surface-card space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-brand-graphite">{check.label}</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(check.status)}`}>{getStatusLabel(check.status)}</span>
            </div>
            <p className="text-base font-semibold text-brand-orange">{check.value}</p>
            <p className="text-sm leading-6 text-brand-slate">{check.description}</p>
            <p className="rounded-2xl bg-brand-surface px-4 py-3 text-sm text-brand-graphite">{check.action}</p>
          </article>
        ))}
      </div>

      <div className="surface-card space-y-4">
        <div>
          <p className="text-sm font-semibold text-brand-orange">Data Summary</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-brand-graphite">데이터 건수</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {diagnostics.dataSummary.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-brand-border bg-white px-5 py-5">
              <p className="text-sm text-brand-slate">{item.label}</p>
              <p className="mt-3 text-3xl font-black text-brand-graphite">{item.count}</p>
              <p className="mt-2 text-xs text-brand-slate">{item.source === "database" ? "database" : "mock fallback"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-card space-y-4">
        <div>
          <p className="text-sm font-semibold text-brand-orange">Action Items</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-brand-graphite">권장 조치</h2>
        </div>
        <div className="space-y-3">
          {diagnostics.recommendations.map((item) => (
            <p key={item} className="rounded-2xl bg-brand-surface px-4 py-3 text-sm leading-6 text-brand-graphite">
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
