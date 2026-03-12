"use client";

import { useEffect, useRef, useState } from "react";

interface ApplicationRow {
  date: string;
  name: string;
  installStatus: string;
  giftStatus: string;
}

// Deterministic seed-based mock data (same on every render, looks like reference)
const MOCK_DATA: ApplicationRow[] = [
  { date: "03.12", name: "김 * *", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.12", name: "이 * 연", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.12", name: "박 * 호", installStatus: "접수진행", giftStatus: "입금대기" },
  { date: "03.11", name: "최 * *", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.11", name: "정 * 빈", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.11", name: "강 * *", installStatus: "접수진행", giftStatus: "입금대기" },
  { date: "03.10", name: "조 * 서", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.10", name: "윤 * *", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.10", name: "장 * 은", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.09", name: "임 * *", installStatus: "접수진행", giftStatus: "입금대기" },
  { date: "03.09", name: "한 * 민", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.09", name: "오 * *", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.08", name: "서 * 현", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.08", name: "신 * *", installStatus: "접수진행", giftStatus: "입금대기" },
  { date: "03.08", name: "권 * 우", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.07", name: "황 * *", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.07", name: "안 * 진", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.07", name: "송 * *", installStatus: "접수진행", giftStatus: "입금대기" },
  { date: "03.06", name: "류 * 희", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.06", name: "홍 * *", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.06", name: "김 * 수", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.05", name: "이 * *", installStatus: "접수진행", giftStatus: "입금대기" },
  { date: "03.05", name: "박 * 윤", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.05", name: "최 * *", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.04", name: "정 * 은", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.04", name: "강 * *", installStatus: "접수진행", giftStatus: "입금대기" },
  { date: "03.03", name: "조 * 현", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.03", name: "윤 * *", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.02", name: "장 * 서", installStatus: "설치완료", giftStatus: "입금완료" },
  { date: "03.02", name: "임 * *", installStatus: "설치완료", giftStatus: "입금완료" },
];

export function RecentApplications() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll effect like reference site
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (isPaused) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 2) {
        container.scrollTop = 0;
      } else {
        container.scrollTop += 1;
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      className="overflow-hidden rounded-2xl border border-brand-border"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div ref={scrollRef} className="max-h-[360px] overflow-y-auto scrollbar-hide">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-brand-graphite text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">날짜</th>
              <th className="px-4 py-3 text-left font-semibold">이름</th>
              <th className="px-4 py-3 text-center font-semibold">접수현황</th>
              <th className="px-4 py-3 text-center font-semibold">사은품</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {MOCK_DATA.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-brand-surface"}>
                <td className="px-4 py-2.5 text-brand-slate">{row.date}</td>
                <td className="px-4 py-2.5 font-medium text-brand-graphite">{row.name}</td>
                <td className="px-4 py-2.5 text-center">
                  <span
                    className={
                      row.installStatus === "설치완료"
                        ? "inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                        : "inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700"
                    }
                  >
                    {row.installStatus}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span
                    className={
                      row.giftStatus === "입금완료"
                        ? "inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                        : "inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500"
                    }
                  >
                    {row.giftStatus}
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
