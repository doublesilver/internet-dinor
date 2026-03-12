import Link from "next/link";
import { StatusQuickToggle } from "@/components/admin/StatusQuickToggle";
import { getAllProductsAdmin } from "@/lib/repositories/content";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-orange">Products</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">상품 관리</h1>
      </div>
      <div>
        <Link href="/admin/products/new" className="inline-flex rounded-2xl bg-brand-orange px-5 py-3 text-sm font-semibold text-white">
          신규 상품 등록
        </Link>
      </div>
      <div className="grid gap-4">
        {products.map((product) => (
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
      </div>
    </div>
  );
}
