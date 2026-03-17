import type { Metadata } from "next";
import Link from "next/link";
import { getAllCarriersAdmin } from "@/lib/repositories/content";

export const metadata: Metadata = { title: "통신사 관리 - 관리자" };

export default async function AdminCarriersPage() {
  const carriers = await getAllCarriersAdmin();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-orange">통신사 관리</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">통신사 관리</h1>
      </div>
      <div className="grid gap-4">
        {carriers.map((carrier) => (
          <article key={carrier.id} className="surface-card">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-brand-orange">{carrier.shortName}</span>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    carrier.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {carrier.status === "published" ? "게시중" : "임시저장"}
                </span>
                <span className="text-xs text-brand-slate">정렬 {carrier.sortOrder}</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-brand-graphite">{carrier.name}</h2>
            <p className="mt-2 text-sm text-brand-slate">{carrier.summary}</p>
            <div className="mt-4">
              <Link href={`/admin/carriers/${carrier.id}`} className="font-semibold text-brand-orange">
                편집하기
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
