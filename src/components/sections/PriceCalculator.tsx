"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface PriceOption {
  label: string;
  value: number;
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
    // 0=미결합, 1=결합
    phone: [
      { label: "미결합", value: 0 },
      { label: "결합", value: 1 },
    ],
  },
  kt: {
    internet: [
      { label: "100MB", value: 22000 },
      { label: "500MB", value: 33000 },
      { label: "1G", value: 38500 },
    ],
    wifi: [
      { label: "미포함", value: 0 },
      { label: "기본와이파이", value: 1100 },
      { label: "기가와이파이", value: 3300 },
    ],
    tv: [
      { label: "미결합", value: 0 },
      { label: "베이직/233채널", value: 14740 },
      { label: "라이트/237채널", value: 15840 },
      { label: "에센스/263채널", value: 20240 },
      { label: "모든G/256채널", value: 21340 },
      { label: "모든G플러스/256채널", value: 23640 },
    ],
    settopBox: [
      { label: "미포함", value: 0 },
      { label: "기가지니3", value: 4400 },
      { label: "기가지니A", value: 3300 },
      { label: "기가지니3A", value: 4400 },
      { label: "지니TV사운드바", value: 8800 },
    ],
    // 0=미결합, 1=100M(<65k)결합, 2=100M(>=65k)결합, 3=500M+결합
    phone: [
      { label: "미결합", value: 0 },
      { label: "100M(<65k)결합", value: 1 },
      { label: "100M(>=65k)결합", value: 2 },
      { label: "500M+결합", value: 3 },
    ],
  },
  lg: {
    internet: [
      { label: "와이파이기본광랜/100M", value: 22000 },
      { label: "와이파이기본기가슬림/500M", value: 33000 },
      { label: "와이파이기본기가/1G", value: 38500 },
      { label: "프리미엄안심보상100M", value: 27500 },
      { label: "프리미엄안심보상500M", value: 39600 },
      { label: "프리미엄안심보상1G", value: 45100 },
    ],
    wifi: [
      { label: "미포함", value: 0 },
      { label: "기본와이파이", value: 0 },
      { label: "기가WiFi프리미엄", value: 5500 },
    ],
    tv: [
      { label: "미결합", value: 0 },
      { label: "실속형/211채널", value: 15400 },
      { label: "고급형/231채널", value: 17600 },
      { label: "프리미엄/252채널", value: 18700 },
    ],
    settopBox: [
      { label: "미결합", value: 0 },
      { label: "4K UHD4셋탑", value: 4400 },
      { label: "고급형셋탑", value: 3300 },
      { label: "U+tv사운드바셋탑", value: 6600 },
    ],
    // 0=미결합, 1=결합
    phone: [
      { label: "미결합", value: 0 },
      { label: "결합", value: 1 },
    ],
  },
  skylife: {
    internet: [
      { label: "100MB", value: 22000 },
      { label: "200MB", value: 24200 },
      { label: "500MB", value: 33000 },
      { label: "1G", value: 38500 },
    ],
    wifi: [
      { label: "미포함(100M전용)", value: 0 },
      { label: "기본와이파이(100M)", value: 1100 },
      { label: "기본와이파이 포함(200M+)", value: 0 },
    ],
    tv: [
      { label: "미결합", value: 0 },
      { label: "SKY ALL/238채널", value: 9900 },
    ],
    settopBox: [
      { label: "기본셋탑포함", value: 0 },
    ],
    // Skylife: no phone bundle
    phone: [
      { label: "미결합", value: 0 },
    ],
  },
  hellovision: {
    internet: [
      { label: "광랜100M", value: 20790 },
      { label: "광랜160M", value: 25410 },
      { label: "기가라이트500M", value: 29260 },
      { label: "플래티넘기가1G", value: 30800 },
    ],
    wifi: [
      { label: "포함", value: 0 },
    ],
    tv: [
      { label: "미결합", value: 0 },
      { label: "이코노미/109채널", value: 11000 },
      { label: "뉴베이직/245채널", value: 13200 },
      { label: "뉴프리미엄/245채널", value: 15400 },
    ],
    settopBox: [
      { label: "포함/UHD셋탑", value: 4400 },
    ],
    // Hellovision: no phone bundle
    phone: [
      { label: "미결합", value: 0 },
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

/**
 * Calculate SK discount based on phone/TV/internet selections.
 * phone: 0=미결합, 1=결합
 * tv: 0=미결합, else=has TV
 * internetValue: price of internet (22000=100M, 33000=500M, 38500=1G)
 */
function calcSkDiscount(phoneIdx: number, tvIdx: number, internetValue: number): number {
  const hasPhone = phoneIdx === 1;
  const hasTV = tvIdx > 0;
  const is100M = internetValue === 22000;

  if (!hasPhone && hasTV) {
    // No phone + TV
    if (is100M) return 3300; // 1,100 + 2,200
    return 7700; // 5,500 + 2,200
  }
  if (hasPhone && !hasTV) {
    // With phone, no TV
    if (is100M) return 4400;
    if (internetValue === 33000) return 11000; // 500M
    return 13200; // 1G
  }
  if (hasPhone && hasTV) {
    // With phone + TV
    if (is100M) return 11200; // 4,400 + 2,200 + 1,100 + 3,500
    if (internetValue === 33000) return 17800; // 500M: 11,000 + 2,200 + 1,100 + 3,500
    return 20000; // 1G: 13,200 + 2,200 + 1,100 + 3,500
  }
  return 0;
}

/**
 * Calculate KT discount.
 * phoneIdx: 0=미결합, 1=100M<65k, 2=100M>=65k, 3=500M+
 * tvIdx: 0=미결합, 1-2=basic/light, 3+=premium
 * internetValue: 22000=100M, 33000=500M, 38500=1G
 */
function calcKtDiscount(phoneIdx: number, tvIdx: number, internetValue: number): number {
  const hasTV = tvIdx > 0;
  // TV type: idx 1,2 = basic/light; idx 3+ = premium (에센스/모든G/모든G플러스)
  const isPremiumTV = tvIdx >= 3;
  const isHighSpeed = internetValue >= 33000; // 500M or 1G

  if (phoneIdx === 0) {
    // 미결합
    if (!hasTV) return 0;
    if (isHighSpeed) {
      return isPremiumTV ? 9240 : 8140; // 5,500+3,740 or 5,500+2,640
    }
    return isPremiumTV ? 3740 : 2640; // 100M
  }
  if (phoneIdx === 1) {
    // 100M(<65k)결합: discount 3,300
    if (!hasTV) return 3300;
    if (isPremiumTV) return 7040; // 3,740 + 3,300
    return 5940; // 2,640 + 3,300
  }
  if (phoneIdx === 2) {
    // 100M(>=65k)결합: discount 5,500
    if (!hasTV) return 5500;
    if (isPremiumTV) return 9240; // 3,740 + 5,500
    return 8140; // 2,640 + 5,500
  }
  if (phoneIdx === 3) {
    // 500M+결합: discount 5,500 on internet
    if (!hasTV) return 5500;
    if (isPremiumTV) return 14740; // 5,500 + 5,500 + 3,740
    return 13640; // 5,500 + 5,500 + 2,640
  }
  return 0;
}

/**
 * Calculate LG discount.
 * phoneIdx: 0=미결합, 1=결합
 * tvIdx: 0=미결합, else=has TV
 * internetValue: price of internet
 */
function calcLgDiscount(phoneIdx: number, tvIdx: number, internetValue: number): number {
  const hasPhone = phoneIdx === 1;
  const hasTV = tvIdx > 0;
  const isLow = internetValue <= 27500;    // <=27,500
  const isMid = internetValue > 27500 && internetValue < 39600; // >27,500 & <39,600
  // >=39,600 is the remaining case

  if (!hasPhone && hasTV) {
    if (isLow) return 2200;
    return 7700; // 5,500 + 2,200
  }
  if (hasPhone && !hasTV) {
    if (isLow) return 5500;
    return 9900; // mid or high
  }
  if (hasPhone && hasTV) {
    if (isLow) return 7700; // 5,500 + 2,200
    if (isMid) return 17600; // 9,900 + 5,500 + 2,200
    return 17600; // >=39,600: 13,200 + 5,500 + 2,200 - 3,300
  }
  return 0;
}

/**
 * Calculate Skylife discount.
 * tvIdx: 0=미결합, else=has TV
 * internetValue: price of internet
 */
function calcSkylifeDiscount(tvIdx: number, internetValue: number): number {
  if (tvIdx === 0) return 0;
  const isHighSpeed = internetValue >= 33000;
  return isHighSpeed ? 5500 : 2200;
}

/**
 * Calculate Hellovision discount.
 * tvIdx: 0=미결합, else=has TV
 * internetValue: price of internet
 */
function calcHellovisionDiscount(tvIdx: number, internetValue: number): number {
  if (tvIdx === 0) return 0;
  if (internetValue === 20790) return 6660;  // 100M: 2,200 + 4,460
  if (internetValue === 25410) return 7650;  // 160M: 2,200 + 5,450
  if (internetValue === 29260) return 8470;  // 500M: 2,200 + 6,270
  if (internetValue === 30800) return 8800;  // 1G: 2,200 + 6,600
  return 0;
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
  }), [selections, pricing]);

  const discount = useMemo(() => {
    if (!pricing) return 0;
    const phoneIdx = selections.phone;
    const tvIdx = selections.tv;
    const internetValue = prices.internet;

    switch (carrierSlug) {
      case "sk":
        return calcSkDiscount(phoneIdx, tvIdx, internetValue);
      case "kt":
        return calcKtDiscount(phoneIdx, tvIdx, internetValue);
      case "lg":
        return calcLgDiscount(phoneIdx, tvIdx, internetValue);
      case "skylife":
        return calcSkylifeDiscount(tvIdx, internetValue);
      case "hellovision":
        return calcHellovisionDiscount(tvIdx, internetValue);
      default:
        return 0;
    }
  }, [selections, prices, carrierSlug, pricing]);

  const subtotal = useMemo(() => {
    return prices.internet + prices.wifi + prices.tv + prices.settopBox;
  }, [prices]);

  const totalPrice = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

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
          {discount > 0 && (
            <>
              <span className="text-gray-300">−</span>
              <span className="rounded-lg bg-red-50 px-3 py-1.5 text-red-500 shadow-sm">결합할인 <strong>{formatPrice(discount)}</strong>원</span>
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
