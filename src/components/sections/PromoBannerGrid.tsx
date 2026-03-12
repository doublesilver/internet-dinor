"use client";

import Link from "next/link";

const PROMO_BANNERS = [
  {
    title: "후기 작성하고 스타벅스 받자!",
    description: "가입 후기 작성 시 스타벅스 기프티콘 증정",
    href: "/reviews",
    bgColor: "#00704A",
    textColor: "#ffffff",
    icon: "☕",
  },
  {
    title: "소상공인 특별 혜택",
    description: "사업장 인터넷 가입 시 추가 사은품",
    href: "/board/event",
    bgColor: "#2DC2F1",
    textColor: "#ffffff",
    icon: "🏢",
  },
  {
    title: "제휴카드 할인 안내",
    description: "통신사 제휴카드로 매월 할인 받기",
    href: "/board/guide",
    bgColor: "#FF5B62",
    textColor: "#ffffff",
    icon: "💳",
  },
  {
    title: "렌탈 결합 할인",
    description: "정수기·공기청정기 결합 시 추가 할인",
    href: "/board/event",
    bgColor: "#FFA13E",
    textColor: "#ffffff",
    icon: "🏠",
  },
];

export function PromoBannerGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {PROMO_BANNERS.map((banner) => (
        <Link
          key={banner.title}
          href={banner.href}
          className="group flex flex-col justify-between rounded-2xl p-5 transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: banner.bgColor, color: banner.textColor }}
        >
          <span className="mb-3 text-3xl">{banner.icon}</span>
          <div>
            <p className="text-base font-bold leading-snug">{banner.title}</p>
            <p className="mt-1 text-sm opacity-80">{banner.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
