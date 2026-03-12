"use client";

import { useEffect, useState } from "react";

interface ApplicationRow {
  date: string;
  name: string;
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
  const statuses = ["개통완료", "설치예정", "개통완료", "개통완료", "설치예정", "개통완료"];
  const payStatuses = ["지급완료", "지급예정", "지급완료", "지급완료", "지급예정", "지급완료"];

  const rows: ApplicationRow[] = [];
  const now = new Date();

  for (let i = 0; i < 20; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 14));
    const fullName = surnames[Math.floor(Math.random() * surnames.length)] + names[Math.floor(Math.random() * names.length)];

    rows.push({
      date: `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`,
      name: maskName(fullName),
      installStatus: statuses[Math.floor(Math.random() * statuses.length)],
      paymentStatus: payStatuses[Math.floor(Math.random() * payStatuses.length)]
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
              <th className="px-4 py-3 text-left font-semibold">날짜</th>
              <th className="px-4 py-3 text-left font-semibold">신청자</th>
              <th className="px-4 py-3 text-center font-semibold">설치현황</th>
              <th className="px-4 py-3 text-center font-semibold">입금현황</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-brand-surface"}>
                <td className="px-4 py-2.5 text-brand-slate">{row.date}</td>
                <td className="px-4 py-2.5 font-medium text-brand-graphite">{row.name}</td>
                <td className="px-4 py-2.5 text-center">
                  <span className={row.installStatus === "개통완료" ? "status-badge-complete" : "status-badge-progress"}>
                    {row.installStatus}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center">
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
