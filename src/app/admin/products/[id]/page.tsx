import { notFound } from "next/navigation";
import { DeleteEntityButton } from "@/components/admin/DeleteEntityButton";
import { ProductEditorForm } from "@/components/admin/ProductEditorForm";
import { getCarriers, getProductById } from "@/lib/repositories/content";

export default async function AdminProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, carriers] = await Promise.all([getProductById(id), getCarriers()]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-orange">Product Editor</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">{product.name}</h1>
      </div>
      <DeleteEntityButton endpoint={`/api/admin/products/${product.id}`} redirectTo="/admin/products" label="상품" />
      <ProductEditorForm product={product} carriers={carriers} />
    </div>
  );
}
