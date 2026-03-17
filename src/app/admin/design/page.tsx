import type { Metadata } from "next";
import { DesignEditorForm } from "@/components/admin/DesignEditorForm";
import { getSiteSettings } from "@/lib/repositories/content";

export const metadata: Metadata = { title: "디자인 설정 - 관리자" };

export default async function AdminDesignPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-orange">Design</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">디자인 설정</h1>
        <p className="mt-1 text-sm text-brand-slate">폰트 크기, 색상, 레이아웃을 조정합니다. 변경 사항은 즉시 사이트에 적용됩니다.</p>
      </div>
      <DesignEditorForm designSettings={settings.designSettings} />
    </div>
  );
}
