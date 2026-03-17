import type { Metadata } from "next";
import Link from "next/link";
import { StatusQuickToggle } from "@/components/admin/StatusQuickToggle";
import { getAllProductsAdmin, getCarriers } from "@/lib/repositories/content";

export const metadata: Metadata = { title: "상품 관리 - 관리자" };

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; carrierId?: string }>;
}) {
  const { status, carrierId } = await searchParams;
  const [products, carriers] = await Promise.all([getAllProductsAdmin(), getCarriers()]);

  const filtered = products.filter((product) => {
    if (status === "published" || status === "draft") {
      if (product.status !== status) return false;
    }
    if (carrierId) {
      if (product.carrierId !== carrierId) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-orange">상품 관리</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">상품 관리</h1>
      </div>
      <div>
        <Link href="/admin/products/new" className="inline-flex rounded-2xl bg-brand-orange px-5 py-3 text-sm font-semibold text-white">
          신규 상품 등록
        </Link>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-brand-slate">상태:</span>
          {[
            { value: "", label: "전체" },
            { value: "published", label: "게시중" },
            { value: "draft", label: "임시저장" }
          ].map((option) => (
            <Link
              key={option.value}
              href={`/admin/products?${new URLSearchParams({ ...(option.value ? { status: option.value } : {}), ...(carrierId ? { carrierId } : {}) }).toString()}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                (status ?? "") === option.value ? "bg-brand-orange text-white" : "bg-brand-surface text-brand-graphite"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-brand-slate">통신사:</span>
          <Link
            href={`/admin/products?${new URLSearchParams({ ...(status ? { status } : {}) }).toString()}`}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${!carrierId ? "bg-brand-orange text-white" : "bg-brand-surface text-brand-graphite"}`}
          >
            전체
          </Link>
          {carriers.map((carrier) => (
            <Link
              key={carrier.id}
              href={`/admin/products?${new URLSearchParams({ ...(status ? { status } : {}), carrierId: carrier.id }).toString()}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${carrierId === carrier.id ? "bg-brand-orange text-white" : "bg-brand-surface text-brand-graphite"}`}
            >
              {carrier.shortName}
            </Link>
          ))}
        </div>
      </div>
      <div className="grid gap-4">
        {filtered.map((product) => (
          <article key={product.id} className="surface-card">
            <div className="flex items-center justify-between gap-3">
              <StatusQuickToggle endpoint={`/api/admin/products/${product.id}/status`} initialStatus={product.status} entityLabel="상품" />
              <span className="text-xs text-brand-slate">정렬 {product.sortOrder}</span>
            </div>
            <h2 className="text-xl font-bold text-brand-graphite">{product.name}</h2>
            <p className="mt-2 text-sm text-brand-slate">{product.summary}</p>
            <div className="mt-4">
              <Link href={`/admin/products/${product.id}`} className="font-semibold text-brand-orange">
                편집하기
              </Link>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-brand-slate">조건에 맞는 상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
