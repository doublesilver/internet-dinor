import { notFound } from "next/navigation";
import { CarrierEditorForm } from "@/components/admin/CarrierEditorForm";
import { getCarrierById } from "@/lib/repositories/content";

export default async function AdminCarrierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const carrier = await getCarrierById(id);

  if (!carrier) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-orange">Carrier Editor</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">{carrier.name}</h1>
      </div>
      <CarrierEditorForm carrier={carrier} />
    </div>
  );
}
