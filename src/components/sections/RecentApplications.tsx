"use client";

import { useEffect, useRef, useState } from "react";
import { buildPublicRecentApplications } from "@/data/fixtures/recent-applications";

const PUBLIC_ROWS = buildPublicRecentApplications();

export function RecentApplications() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (isPaused) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 2) {
        container.scrollTop = 0;
        return;
      }

      container.scrollTop += 1;
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
            {PUBLIC_ROWS.map((row, index) => (
              <tr key={`${row.date}-${row.name}-${index}`} className={index % 2 === 0 ? "bg-white" : "bg-brand-surface"}>
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
