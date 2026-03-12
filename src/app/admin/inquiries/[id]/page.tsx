import { notFound } from "next/navigation";
import { InquiryEditor } from "@/components/admin/InquiryEditor";
import { getProductById } from "@/lib/repositories/content";
import { getInquiryById, getInquiryStatusLabel } from "@/lib/repositories/inquiries";
import { formatDate } from "@/lib/utils/date";

export default async function AdminInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = await getInquiryById(id);
  if (!inquiry) notFound();

  const product = inquiry.productId ? await getProductById(inquiry.productId) : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-orange">Inquiry Detail</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">{inquiry.name} 문의 상세</h1>
      </div>
      <div className="surface-card grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <p>
            <strong>유형:</strong> {inquiry.inquiryType}
          </p>
          <p>
            <strong>상태:</strong> {getInquiryStatusLabel(inquiry.status)}
          </p>
          <p>
            <strong>연락처:</strong> {inquiry.phone}
          </p>
          <p>
            <strong>설치 지역:</strong> {inquiry.regionLabel ?? "-"}
          </p>
          <p>
            <strong>상품:</strong> {product?.name ?? "-"}
          </p>
          <p>
            <strong>접수일:</strong> {formatDate(inquiry.createdAt)}
          </p>
        </div>
        <div className="space-y-3">
          <InquiryEditor inquiry={inquiry} />
        </div>
      </div>
    </div>
  );
}
