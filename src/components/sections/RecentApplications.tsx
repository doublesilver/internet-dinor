"use client";

import { useEffect, useState } from "react";

interface ApplicationRow {
  date: string;
  name: string;
  carrier: string;
  product: string;
  region: string;
  installStatus: string;
  paymentStatus: string;
}

function maskName(name: string): string {
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + "*";
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
}

// Generate mock data for display when no real data
function generateMockData(): ApplicationRow[] {
  const surnames = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "류", "홍"];
  const names = ["민수", "서연", "지훈", "수빈", "영호", "미영", "태윤", "하은", "준서", "예진", "성민", "소희", "재현", "유나", "동현", "지은", "현우", "다은", "시우", "채원"];
  const carriers = ["SK브로드밴드", "KT", "LG유플러스", "KT스카이라이프", "LG헬로비전"];
  const products = ["인터넷+TV", "인터넷단독", "인터넷+TV+전화", "인터넷+TV 결합"];
  const regions = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

  const rows: ApplicationRow[] = [];
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(i / 3));
    const fullName = surnames[Math.floor(Math.random() * surnames.length)] + names[Math.floor(Math.random() * names.length)];
    const isComplete = Math.random() > 0.3;

    rows.push({
      date: `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`,
      name: maskName(fullName),
      carrier: carriers[Math.floor(Math.random() * carriers.length)],
      product: products[Math.floor(Math.random() * products.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      installStatus: isComplete ? "개통완료" : "설치예정",
      paymentStatus: isComplete ? "지급완료" : "지급예정"
    });
  }

  return rows;
}

export function RecentApplications() {
  const [rows, setRows] = useState<ApplicationRow[]>([]);

  useEffect(() => {
    // Try to fetch real data, fall back to mock
    fetch("/api/recent-applications")
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json() as Promise<ApplicationRow[]>;
      })
      .then(setRows)
      .catch(() => {
        setRows(generateMockData());
      });
  }, []);

  if (rows.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-border">
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-brand-graphite text-white">
            <tr>
              <th className="px-3 py-3 text-left font-semibold">날짜</th>
              <th className="px-3 py-3 text-left font-semibold">신청자</th>
              <th className="hidden px-3 py-3 text-left font-semibold sm:table-cell">지역</th>
              <th className="px-3 py-3 text-left font-semibold">통신사</th>
              <th className="hidden px-3 py-3 text-left font-semibold md:table-cell">상품</th>
              <th className="px-3 py-3 text-center font-semibold">설치현황</th>
              <th className="px-3 py-3 text-center font-semibold">입금현황</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-brand-surface"}>
                <td className="px-3 py-2.5 text-brand-slate">{row.date}</td>
                <td className="px-3 py-2.5 font-medium text-brand-graphite">{row.name}</td>
                <td className="hidden px-3 py-2.5 text-brand-slate sm:table-cell">{row.region}</td>
                <td className="px-3 py-2.5 text-brand-slate">{row.carrier}</td>
                <td className="hidden px-3 py-2.5 text-brand-slate md:table-cell">{row.product}</td>
                <td className="px-3 py-2.5 text-center">
                  <span className={row.installStatus === "개통완료" ? "status-badge-complete" : "status-badge-progress"}>
                    {row.installStatus}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className={row.paymentStatus === "지급완료" ? "status-badge-complete" : "status-badge-progress"}>
                    {row.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
