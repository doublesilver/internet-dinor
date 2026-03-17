import type { Metadata } from "next";
import { SettingsEditorForm } from "@/components/admin/SettingsEditorForm";
import { getSiteSettings } from "@/lib/repositories/content";

export const metadata: Metadata = { title: "설정 - 관리자" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-orange">사이트 설정</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">사이트 기본 설정</h1>
        <p className="mt-1 text-sm text-brand-slate">사이트 이름, 전화번호, 메인 문구 등 기본 정보를 수정합니다.</p>
      </div>
      <SettingsEditorForm settings={settings} />
    </div>
  );
}
