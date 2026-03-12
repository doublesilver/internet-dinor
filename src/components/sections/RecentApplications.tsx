"use client";

import { useEffect, useRef, useState } from "react";

interface ApplicationRow {
  date: string;
  name: string;
  installStatus: string;
  giftStatus: string;
}

function buildMockData(): ApplicationRow[] {
  const today = new Date();
  const fmt = (d: Date) =>
    `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  const dayOffset = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return fmt(d);
  };

  return [
    { date: dayOffset(0), name: "김 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(0), name: "이 * 연", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(0), name: "박 * 호", installStatus: "접수진행", giftStatus: "입금대기" },
    { date: dayOffset(1), name: "최 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(1), name: "정 * 빈", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(1), name: "강 * *", installStatus: "접수진행", giftStatus: "입금대기" },
    { date: dayOffset(2), name: "조 * 서", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(2), name: "윤 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(2), name: "장 * 은", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(3), name: "임 * *", installStatus: "접수진행", giftStatus: "입금대기" },
    { date: dayOffset(3), name: "한 * 민", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(3), name: "오 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(4), name: "서 * 현", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(4), name: "신 * *", installStatus: "접수진행", giftStatus: "입금대기" },
    { date: dayOffset(4), name: "권 * 우", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(5), name: "황 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(5), name: "안 * 진", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(5), name: "송 * *", installStatus: "접수진행", giftStatus: "입금대기" },
    { date: dayOffset(6), name: "류 * 희", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(6), name: "홍 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(6), name: "김 * 수", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(7), name: "이 * *", installStatus: "접수진행", giftStatus: "입금대기" },
    { date: dayOffset(7), name: "박 * 윤", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(7), name: "최 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(8), name: "정 * 은", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(8), name: "강 * *", installStatus: "접수진행", giftStatus: "입금대기" },
    { date: dayOffset(9), name: "조 * 현", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(9), name: "윤 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(10), name: "장 * 서", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(10), name: "임 * *", installStatus: "설치완료", giftStatus: "입금완료" },
  ];
}

const MOCK_DATA = buildMockData();

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
