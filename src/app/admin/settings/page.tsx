import type { Metadata } from "next";
import { SettingsEditorForm } from "@/components/admin/SettingsEditorForm";
import { getSiteSettings } from "@/lib/repositories/content";

export const metadata: Metadata = { title: "설정 - 관리자" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-orange">Settings</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">기본 설정</h1>
      </div>
      <SettingsEditorForm settings={settings} />
    </div>
  );
}
