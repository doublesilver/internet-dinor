import type { Metadata } from "next";
import Link from "next/link";
import { getInquiryFixtures, getInquiryStatusLabel } from "@/lib/repositories/inquiries";
import { formatDate } from "@/lib/utils/date";

export const metadata: Metadata = { title: "문의 관리 - 관리자" };

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiryFixtures();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-orange">문의 관리</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">문의 관리</h1>
      </div>
      <div className="overflow-hidden rounded-[24px] border border-brand-border bg-white">
        <table className="min-w-full divide-y divide-brand-border text-sm">
          <thead className="bg-brand-surface">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-brand-graphite">이름</th>
              <th className="px-4 py-3 text-left font-semibold text-brand-graphite">유형</th>
              <th className="px-4 py-3 text-left font-semibold text-brand-graphite">상태</th>
              <th className="px-4 py-3 text-left font-semibold text-brand-graphite">접수일</th>
              <th className="px-4 py-3 text-left font-semibold text-brand-graphite">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td className="px-4 py-3 text-brand-graphite">{inquiry.name}</td>
                <td className="px-4 py-3 text-brand-slate">{inquiry.inquiryType}</td>
                <td className="px-4 py-3 text-brand-slate">{getInquiryStatusLabel(inquiry.status)}</td>
                <td className="px-4 py-3 text-brand-slate">{formatDate(inquiry.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/inquiries/${inquiry.id}`} className="font-semibold text-brand-orange">
                    보기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
