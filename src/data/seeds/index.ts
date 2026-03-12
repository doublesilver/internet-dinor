import type { Carrier, Post, Product, Review, SiteSettings } from "@/types/domain";

export const siteSettingsSeed: SiteSettings = {
  siteName: "인터넷공룡",
  phoneLabel: "1660-1234",
  phoneLink: "tel:16601234",
  heroCtaLabel: "30초 상담 받기",
  secondaryCtaLabel: "전화 상담",
  footerNotice: "본 사이트의 요금 및 혜택 정보는 1차 제작물 기준의 가상 데이터입니다.",
  businessInfo: {
    owner: "인터넷공룡",
    businessNumber: "123-45-67890",
    address: "서울시 강동구 예시로 123",
    email: "hello@internetdinor.co.kr"
  }
};

export const carriersSeed: Carrier[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    slug: "sk",
    name: "SK형 인터넷",
    shortName: "SK형",
    summary: "빠른 속도와 결합 상담 수요가 높은 대표 라인",
    heroTitle: "SK형 인터넷/TV, 이런 분께 잘 맞습니다",
    heroDescription: "속도, 결합, 가족 사용 패턴 중심으로 많이 비교하는 라인입니다.",
    featurePoints: ["속도형 구성", "가족 결합 상담", "TV 포함 대표 조합"],
    status: "published",
    sortOrder: 10
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    slug: "kt",
    name: "KT형 인터넷",
    shortName: "KT형",
    summary: "안정성과 기본 구성을 우선하는 사용자에게 적합",
    heroTitle: "KT형 인터넷/TV, 안정적인 구성을 찾는 분께",
    heroDescription: "약정 만료 고객과 기본형 비교 상담에 자주 쓰이는 라인입니다.",
    featurePoints: ["안정성 중심", "기본형 추천", "재약정 비교"],
    status: "published",
    sortOrder: 20
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    slug: "lg",
    name: "LG형 인터넷",
    shortName: "LG형",
    summary: "와이파이 포함형과 실속 혜택을 강조하는 라인",
    heroTitle: "LG형 인터넷/TV, 실속형 구성을 쉽게 비교하세요",
    heroDescription: "1인 가구, 신혼 가구, 와이파이 포함형 수요에 맞는 구성입니다.",
    featurePoints: ["와이파이 포함형", "실속형 혜택", "가벼운 진입"],
    status: "published",
    sortOrder: 30
  }
];

export const productsSeed: Product[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    carrierId: "11111111-1111-1111-1111-111111111111",
    slug: "safe-500-tv-basic",
    name: "안심 500 + TV 베이직",
    summary: "가족 단위에 맞는 대표 결합형 상품",
    description: "인터넷과 TV를 한 번에 비교하고 싶은 고객에게 적합한 대표 패키지입니다.",
    bundleType: "internet_tv",
    internetSpeed: "500M",
    tvIncluded: true,
    monthlyPriceLabel: "월 39,000원대",
    benefitLabel: "상담 시 혜택 안내",
    badgeTags: ["인기", "추천"],
    targetTags: ["가족", "TV포함", "결합상담"],
    heroPoints: ["500M 속도", "TV 베이직 포함", "가족 단위 추천"],
    detailSections: [
      { title: "추천 대상", body: "TV 포함 구성을 원하는 가족 단위 사용자에게 적합합니다." },
      { title: "상담 포인트", body: "휴대폰 결합 여부와 설치 일정 기준으로 혜택 차이가 발생할 수 있습니다." }
    ],
    faqItems: [
      { q: "인터넷만 따로 가입도 가능한가요?", a: "가능합니다. 단독형 상품도 함께 비교 안내합니다." },
      { q: "휴대폰 결합은 필수인가요?", a: "필수는 아니며, 결합 가능 여부만 확인해도 됩니다." }
    ],
    isFeatured: true,
    status: "published",
    sortOrder: 10
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    carrierId: "22222222-2222-2222-2222-222222222222",
    slug: "steady-100-internet",
    name: "안정 100 인터넷",
    summary: "인터넷 단독으로 가볍게 시작하는 실속형 상품",
    description: "1인 가구와 실속형 가입 문의에 맞는 기본 상품입니다.",
    bundleType: "internet_only",
    internetSpeed: "100M",
    tvIncluded: false,
    monthlyPriceLabel: "월 22,000원대",
    benefitLabel: "조건별 상담 혜택",
    badgeTags: ["실속형"],
    targetTags: ["1인 가구", "인터넷 단독", "약정만료"],
    heroPoints: ["100M 기본형", "인터넷 단독", "실속 상담"],
    detailSections: [
      { title: "추천 대상", body: "영상 시청과 웹 사용 위주의 1인 가구에 적합합니다." },
      { title: "유의사항", body: "실제 환경과 결합 여부에 따라 추천안은 달라질 수 있습니다." }
    ],
    faqItems: [
      { q: "TV를 나중에 추가할 수 있나요?", a: "가능하며 상담 시 추가 구성을 안내합니다." }
    ],
    isFeatured: true,
    status: "published",
    sortOrder: 20
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    carrierId: "33333333-3333-3333-3333-333333333333",
    slug: "smart-500-wifi-tv",
    name: "스마트 500 + 와이파이 + TV",
    summary: "와이파이 포함형과 혜택형 구성을 찾는 고객용",
    description: "신혼/가족 가구에서 많이 보는 밸런스형 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "500M",
    tvIncluded: true,
    monthlyPriceLabel: "월 41,000원대",
    benefitLabel: "가상 혜택 예시 제공",
    badgeTags: ["혜택형", "와이파이"],
    targetTags: ["신혼", "와이파이", "TV포함"],
    heroPoints: ["와이파이 포함", "TV 동시 가입", "신혼/가족 추천"],
    detailSections: [
      { title: "추천 대상", body: "와이파이 포함 구성을 선호하는 가정용 사용자에게 적합합니다." },
      { title: "비교 포인트", body: "TV 필요 여부와 휴대폰 결합 관심 여부를 먼저 확인하는 것이 좋습니다." }
    ],
    faqItems: [
      { q: "와이파이 포함 여부가 중요한가요?", a: "설치 편의와 체감 비용을 줄이는 데 도움이 됩니다." }
    ],
    isFeatured: true,
    status: "published",
    sortOrder: 30
  }
];

export const postsSeed: Post[] = [
  {
    id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    type: "event",
    slug: "spring-consult-benefit",
    title: "봄 시즌 상담 혜택 안내",
    summary: "상담 유도를 위한 대표 혜택형 게시물 예시입니다.",
    body: "이번 달에는 설치 시기, 결합 여부, 상품 구성에 따라 상담 가능한 혜택 예시를 안내합니다.",
    ctaLabel: "혜택 문의하기",
    relatedProductSlugs: ["safe-500-tv-basic", "smart-500-wifi-tv"],
    isFeatured: true,
    publishedAt: "2026-03-11T09:00:00.000Z",
    status: "published"
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    type: "guide",
    slug: "how-to-choose-internet-speed",
    title: "인터넷 속도는 어떻게 고르면 될까요?",
    summary: "100M, 500M, 1G 중 어떤 구성이 맞는지 쉽게 설명합니다.",
    body: "1인 가구, 가족 단위, 재택 여부를 기준으로 속도 선택 기준을 안내합니다.",
    ctaLabel: "가이드 보고 문의하기",
    relatedProductSlugs: ["steady-100-internet", "safe-500-tv-basic"],
    isFeatured: true,
    publishedAt: "2026-03-11T09:00:00.000Z",
    status: "published"
  },
  {
    id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
    type: "notice",
    slug: "phase1-demo-notice",
    title: "현재 사이트는 1차 시범 데이터로 운영됩니다",
    summary: "가상 데이터 기반의 1차 제작물 안내 공지입니다.",
    body: "상품/혜택/후기 정보는 실제 운영 전 교체 예정이며, 현재는 구조와 흐름 검토용입니다.",
    ctaLabel: "문의하기",
    relatedProductSlugs: [],
    isFeatured: false,
    publishedAt: "2026-03-11T09:00:00.000Z",
    status: "published"
  }
];

export const reviewsSeed: Review[] = [
  {
    id: "12121212-1212-1212-1212-121212121212",
    slug: "moving-house-fast-consult",
    title: "이사 일정에 맞춰 빠르게 상담받았어요",
    summary: "이사 전 급하게 인터넷이 필요했는데 비교 설명이 빠르게 정리됐습니다.",
    body: "설치 일정이 촉박한 상황이었지만 신규와 변경 시나리오를 한 번에 안내받아 결정이 빨랐습니다.",
    reviewType: "moving",
    tags: ["이사", "빠른상담", "인터넷+TV"],
    featured: true,
    publishedAt: "2026-03-11T09:00:00.000Z",
    status: "published"
  },
  {
    id: "34343434-3434-3434-3434-343434343434",
    slug: "family-bundle-compare-review",
    title: "가족 결합 조건을 쉽게 비교할 수 있었어요",
    summary: "휴대폰 결합 여부에 따라 어떤 차이가 있는지 이해하기 쉬웠습니다.",
    body: "통신사별 장단점과 결합 가능성을 함께 설명해줘서 상품 선택이 한결 수월했습니다.",
    reviewType: "bundle",
    tags: ["가족", "결합", "상담만족"],
    featured: false,
    publishedAt: "2026-03-10T09:00:00.000Z",
    status: "published"
  }
];
