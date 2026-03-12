import type { InquiryRecord } from "@/types/domain";

export const inquiryFixtures: InquiryRecord[] = [
  {
    id: "inq-demo-001",
    inquiryType: "quick",
    name: "홍길동",
    phone: "010-1234-5678",
    sourcePage: "/",
    status: "new",
    privacyAgreed: true,
    payload: {},
    utm: { utm_source: "naver" },
    createdAt: "2026-03-11T09:00:00.000Z",
    updatedAt: "2026-03-11T09:00:00.000Z"
  },
  {
    id: "inq-demo-002",
    inquiryType: "product",
    name: "김상담",
    phone: "010-2345-6789",
    productId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    carrierSlug: "sk",
    sourcePage: "/products/safe-500-tv-basic",
    status: "contacted",
    privacyAgreed: true,
    regionLabel: "서울 강동구",
    contactTimePreference: "evening",
    payload: { signup_type: "carrier_change", desired_bundle: "internet_tv" },
    utm: { utm_source: "google" },
    adminMemo: "1차 연락 완료",
    createdAt: "2026-03-10T06:00:00.000Z",
    updatedAt: "2026-03-10T08:00:00.000Z"
  },
  {
    id: "inq-demo-003",
    inquiryType: "apply",
    name: "이고객",
    phone: "010-3456-7890",
    sourcePage: "/apply",
    status: "pending",
    privacyAgreed: true,
    regionLabel: "경기 하남시",
    contactTimePreference: "afternoon",
    payload: { desired_speed: "100M", tv_required: false },
    utm: {},
    createdAt: "2026-03-09T12:00:00.000Z",
    updatedAt: "2026-03-09T12:00:00.000Z"
  }
];
