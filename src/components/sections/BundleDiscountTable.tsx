"use client";

import { getCarrierAccentColor } from "@/lib/constants/carriers";

interface TableRow {
  cells: string[];
}

interface DiscountTable {
  title: string;
  headers: string[];
  rows: TableRow[];
}

const bundleData: Record<string, DiscountTable[]> = {
  sk: [
    {
      title: "요즘가족결합 – 광랜 계열",
      headers: ["회선수", "이동전화 할인", "인터넷 할인"],
      rows: [
        { cells: ["1회선", "없음", "없음"] },
        { cells: ["2회선", "각 5,500원", "3,300원"] },
        { cells: ["3회선", "각 8,800원", "6,600원"] },
        { cells: ["4회선 이상", "각 11,000원", "11,000원"] },
      ],
    },
    {
      title: "요즘가족결합 – 기가 계열",
      headers: ["회선수", "이동전화 할인", "인터넷 할인"],
      rows: [
        { cells: ["1회선", "없음", "없음"] },
        { cells: ["2회선", "각 5,500원", "5,500원"] },
        { cells: ["3회선", "각 8,800원", "8,800원"] },
        { cells: ["4회선 이상", "각 11,000원", "13,200원"] },
      ],
    },
  ],
  kt: [
    {
      title: "총액 결합할인",
      headers: ["구분", "3만원대", "5만원대", "7만원대", "9만원대 이상"],
      rows: [
        { cells: ["인터넷 할인", "3,300원", "5,500원", "8,800원", "11,000원"] },
        { cells: ["이동전화 할인", "3,300원", "5,500원", "8,800원", "11,000원"] },
      ],
    },
  ],
  lg: [
    {
      title: "참 쉬운 가족결합",
      headers: ["회선수", "모바일할인(3만원대)", "모바일할인(5만원대)", "모바일할인(7만원 이상)", "가족데이터", "인터넷 할인"],
      rows: [
        { cells: ["1회선", "1,100원", "2,200원", "3,300원", "1GB", "없음"] },
        { cells: ["2회선", "3,300원", "5,500원", "7,700원", "3GB", "3,300원"] },
        { cells: ["3회선", "5,500원", "8,800원", "11,000원", "5GB", "5,500원"] },
        { cells: ["4회선 이상", "7,700원", "11,000원", "14,300원", "10GB", "8,800원"] },
      ],
    },
  ],
  skylife: [],
  hellovision: [],
};

interface BundleDiscountTableProps {
  carrierSlug: string;
}

export function BundleDiscountTable({ carrierSlug }: BundleDiscountTableProps) {
  const tables = bundleData[carrierSlug];
  const accentColor = getCarrierAccentColor(carrierSlug);

  if (!tables || tables.length === 0) return null;

  return (
    <section className="section-space bg-brand-surface">
      <div className="container-page space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-black text-brand-graphite md:text-3xl">
            결합할인 안내
          </h2>
          <p className="mt-2 text-sm text-brand-slate">
            이동전화와 결합하면 인터넷·TV 요금이 추가 할인됩니다.
          </p>
        </div>

        {tables.map((table) => (
          <div key={table.title} className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm">
            <div
              className="px-5 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: accentColor }}
            >
              {table.title}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border bg-gray-50">
                    {table.headers.map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-center text-xs font-semibold text-brand-slate"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, ri) => (
                    <tr
                      key={ri}
                      className={ri % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
                    >
                      {row.cells.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`px-4 py-3 text-center text-brand-graphite ${ci === 0 ? "font-semibold" : ""}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <p className="text-xs text-brand-slate">
          * 결합할인은 가입 회선 수 및 요금제에 따라 달라질 수 있으며, 통신사 정책 변경 시 내용이 변경될 수 있습니다.
        </p>
      </div>
    </section>
  );
}
