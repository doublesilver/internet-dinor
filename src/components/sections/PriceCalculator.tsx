"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface PriceOption {
  label: string;
  value: number;
  /** TV/phone: 0 means "미결합" */
  extra?: string;
}

interface CarrierPricing {
  internet: PriceOption[];
  wifi: PriceOption[];
  tv: PriceOption[];
  settopBox: PriceOption[];
  phone: PriceOption[];
}

const carrierPricingData: Record<string, CarrierPricing> = {
  sk: {
    internet: [
      { label: "100MB", value: 22000 },
      { label: "500MB", value: 33000 },
      { label: "1G", value: 38500 },
    ],
    wifi: [
      { label: "미포함", value: 0 },
      { label: "기본와이파이", value: 1100 },
      { label: "기가와이파이", value: 3300 },
      { label: "윙즈(와이파이증폭기)", value: 1650 },
    ],
    tv: [
      { label: "미결합", value: 0 },
      { label: "이코노미(183채널)", value: 12100 },
      { label: "스탠다드(234채널)", value: 15400 },
      { label: "ALL(257채널)", value: 18700 },
      { label: "ALL(플러스)", value: 24200 },
    ],
    settopBox: [
      { label: "미포함", value: 0 },
      { label: "스마트3셋탑", value: 4400 },
      { label: "애플TV셋탑", value: 4400 },
      { label: "AI4 셋탑", value: 8800 },
      { label: "AI 스피커형셋탑", value: 6600 },
      { label: "AI Sound Max 셋탑", value: 8800 },
    ],
    phone: [
      { label: "미결합", value: 0 },
      { label: "결합", value: -5500 },
    ],
  },
  kt: {
    internet: [
      { label: "100MB", value: 22000 },
      { label: "500MB", value: 33000 },
      { label: "1G", value: 38500 },
      { label: "2.5G", value: 55000 },
    ],
    wifi: [
      { label: "미포함", value: 0 },
      { label: "기본와이파이", value: 1100 },
      { label: "기가와이파이", value: 3300 },
    ],
    tv: [
      { label: "미결합", value: 0 },
      { label: "올레tv 베이직(161채널)", value: 12100 },
      { label: "올레tv 스탠다드(206채널)", value: 15400 },
      { label: "올레tv 프리미엄(246채널)", value: 18700 },
    ],
    settopBox: [
      { label: "미포함", value: 0 },
      { label: "UHD 2셋탑", value: 4400 },
      { label: "AI 셋탑", value: 6600 },
    ],
    phone: [
      { label: "미결합", value: 0 },
      { label: "결합", value: -5500 },
    ],
  },
  lg: {
    internet: [
      { label: "100MB", value: 22000 },
      { label: "500MB", value: 33000 },
      { label: "1G", value: 38500 },
    ],
    wifi: [
      { label: "미포함", value: 0 },
      { label: "기본와이파이", value: 1100 },
      { label: "WiFi6", value: 3300 },
    ],
    tv: [
      { label: "미결합", value: 0 },
      { label: "U+tv 베이직(167채널)", value: 12100 },
      { label: "U+tv 프라임(214채널)", value: 15400 },
      { label: "U+tv 프리미엄(247채널)", value: 18700 },
    ],
    settopBox: [
      { label: "미포함", value: 0 },
      { label: "UHD 셋탑", value: 4400 },
      { label: "AI 스피커셋탑", value: 6600 },
    ],
    phone: [
      { label: "미결합", value: 0 },
      { label: "결합", value: -5500 },
    ],
  },
  skylife: {
    internet: [
      { label: "100MB", value: 22000 },
      { label: "500MB", value: 33000 },
    ],
    wifi: [
      { label: "미포함", value: 0 },
      { label: "기본와이파이", value: 1100 },
    ],
    tv: [
      { label: "미결합", value: 0 },
      { label: "이코노미(130채널)", value: 11000 },
      { label: "스탠다드(170채널)", value: 14300 },
      { label: "ALL(210채널)", value: 18700 },
    ],
    settopBox: [
      { label: "미포함", value: 0 },
      { label: "HD 셋탑", value: 3300 },
      { label: "UHD 셋탑", value: 5500 },
    ],
    phone: [
      { label: "미결합", value: 0 },
      { label: "결합", value: -3300 },
    ],
  },
  hellovision: {
    internet: [
      { label: "100MB", value: 19800 },
      { label: "500MB", value: 29700 },
    ],
    wifi: [
      { label: "미포함", value: 0 },
      { label: "기본와이파이", value: 1100 },
    ],
    tv: [
      { label: "미결합", value: 0 },
      { label: "이코노미(100채널)", value: 9900 },
      { label: "베이직(140채널)", value: 12100 },
      { label: "프리미엄(180채널)", value: 16500 },
    ],
    settopBox: [
      { label: "미포함", value: 0 },
      { label: "HD 셋탑", value: 3300 },
    ],
    phone: [
      { label: "미결합", value: 0 },
      { label: "결합", value: -3300 },
    ],
  },
};

const categoryIcons: Record<string, string> = {
  internet: "🌐",
  wifi: "📶",
  tv: "📺",
  settopBox: "📡",
  phone: "📱",
};

const categoryLabels: Record<string, string> = {
  internet: "인터넷",
  wifi: "와이파이",
  tv: "IPTV",
  settopBox: "셋톱박스",
  phone: "휴대폰",
};

function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR");
}

interface PriceCalculatorProps {
  carrierSlug: string;
  carrierName: string;
  accentColor?: string;
}

export function PriceCalculator({ carrierSlug, carrierName, accentColor = "#f15c2d" }: PriceCalculatorProps) {
  const pricing = carrierPricingData[carrierSlug];

  const [selections, setSelections] = useState({
    internet: 0,
    wifi: 0,
    tv: 0,
    settopBox: 0,
    phone: 0,
  });

  const prices = useMemo(() => ({
    internet: pricing?.internet[selections.internet]?.value ?? 0,
    wifi: pricing?.wifi[selections.wifi]?.value ?? 0,
    tv: pricing?.tv[selections.tv]?.value ?? 0,
    settopBox: pricing?.settopBox[selections.settopBox]?.value ?? 0,
    phone: pricing?.phone[selections.phone]?.value ?? 0,
  }), [selections, pricing]);

  const totalPrice = useMemo(() => {
    const sum = prices.internet + prices.wifi + prices.tv + prices.settopBox + prices.phone;
    return Math.max(0, sum);
  }, [prices]);

  const phoneDiscount = prices.phone < 0 ? Math.abs(prices.phone) : 0;

  if (!pricing) return null;

  return (
    <div className="rounded-[20px] bg-white shadow-lg overflow-hidden">
      {/* Select boxes */}
      <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-3 lg:grid-cols-5">
        {(["internet", "wifi", "tv", "settopBox", "phone"] as const).map((key) => {
          const options = pricing[key];
          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <span>{categoryIcons[key]}</span>
                <span>{categoryLabels[key]}</span>
              </div>
              <select
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                value={selections[key]}
                onChange={(e) => setSelections((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
              >
                {options.map((opt, idx) => (
                  <option key={idx} value={idx}>{opt.label}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Price breakdown */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-gray-600">
          <span className="rounded-lg bg-white px-3 py-1.5 shadow-sm">인터넷 <strong className="text-gray-900">{formatPrice(prices.internet)}</strong>원</span>
          <span className="text-gray-300">+</span>
          <span className="rounded-lg bg-white px-3 py-1.5 shadow-sm">와이파이 <strong className="text-gray-900">{formatPrice(prices.wifi)}</strong>원</span>
          <span className="text-gray-300">+</span>
          <span className="rounded-lg bg-white px-3 py-1.5 shadow-sm">TV <strong className="text-gray-900">{formatPrice(prices.tv)}</strong>원</span>
          <span className="text-gray-300">+</span>
          <span className="rounded-lg bg-white px-3 py-1.5 shadow-sm">셋톱 <strong className="text-gray-900">{formatPrice(prices.settopBox)}</strong>원</span>
          {phoneDiscount > 0 && (
            <>
              <span className="text-gray-300">−</span>
              <span className="rounded-lg bg-red-50 px-3 py-1.5 text-red-500 shadow-sm">할인 <strong>{formatPrice(phoneDiscount)}</strong>원</span>
            </>
          )}
        </div>
      </div>

      {/* Result */}
      <div className="flex flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:justify-between" style={{ backgroundColor: accentColor }}>
        <p className="text-center text-white sm:text-left">
          <span className="text-lg font-medium">월 요금</span>
          <strong className="ml-3 text-4xl font-black">{formatPrice(totalPrice)}</strong>
          <span className="ml-1 text-lg font-medium">원</span>
        </p>
        <div className="flex gap-3">
          <Link
            href="/apply"
            className="rounded-full bg-white px-6 py-3 text-sm font-bold hover:bg-gray-100"
            style={{ color: accentColor }}
          >
            빠른 견적
          </Link>
          <Link
            href="/apply"
            className="rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
          >
            신청서 작성
          </Link>
        </div>
      </div>
    </div>
  );
}
