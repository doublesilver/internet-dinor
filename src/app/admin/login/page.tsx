import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminAuthDescription, getAdminAuthMode, getAdminAuthSetupMessage, isAdminAuthConfigured, isAdminAuthenticated } from "@/lib/auth/admin";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const authMode = getAdminAuthMode();
  const isConfigured = isAdminAuthConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-surface px-4">
      <div className="surface-card w-full max-w-md">
        <p className="text-sm font-semibold text-brand-orange">Admin Login</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-brand-graphite">관리자 로그인</h1>
        <p className="mt-3 text-sm leading-6 text-brand-slate">{getAdminAuthDescription()}</p>
        <p className="mt-3 rounded-2xl bg-brand-lavender-soft px-4 py-3 text-sm text-brand-graphite">
          인증 모드: <span className="font-semibold">{authMode === "supabase" ? "Supabase Auth" : "Preview Login"}</span>
        </p>
        {!isConfigured ? <p className="mt-3 text-sm text-red-600">{getAdminAuthSetupMessage()}</p> : null}
        <AdminLoginForm />
      </div>
    </div>
  );
}
