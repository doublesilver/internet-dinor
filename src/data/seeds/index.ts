import type { Carrier, Post, Product, Review, SiteSettings } from "@/types/domain";

export const siteSettingsSeed: SiteSettings = {
  siteName: "인터넷공룡",
  phoneLabel: "1660-1234",
  phoneLink: "tel:16601234",
  heroCtaLabel: "최대 지원금 확인",
  secondaryCtaLabel: "전화 상담",
  footerNotice: "인터넷공룡은 통신사 공식 판매점으로 안전하고 빠른 상담을 제공합니다.",
  businessInfo: {
    owner: "인터넷공룡",
    businessNumber: "000-00-00000",
    address: "서울특별시 강동구",
    email: "help@internetdinor.co.kr"
  }
};

export const carriersSeed: Carrier[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    slug: "sk",
    name: "SK브로드밴드",
    shortName: "SK",
    summary: "B tv와 결합 시 최대 혜택, 기가인터넷 대표 통신사",
    heroTitle: "SK브로드밴드 인터넷/TV 상품 비교",
    heroDescription: "SK브로드밴드의 상품, 혜택, 요금을 직접 확인하고 비교해보세요.",
    featurePoints: ["기가인터넷", "B tv", "가족결합 할인", "당일설치"],
    status: "published",
    sortOrder: 10
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    slug: "kt",
    name: "KT",
    shortName: "KT",
    summary: "올레TV와 안정적인 품질, 전국 최대 커버리지",
    heroTitle: "KT 인터넷/TV 상품 비교",
    heroDescription: "KT의 상품, 혜택, 요금을 직접 확인하고 비교해보세요.",
    featurePoints: ["올레TV", "GiGA인터넷", "결합할인", "전국설치"],
    status: "published",
    sortOrder: 20
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    slug: "lg",
    name: "LG유플러스",
    shortName: "LG U+",
    summary: "U+tv와 IoT 결합, 실속형 요금제 강점",
    heroTitle: "LG유플러스 인터넷/TV 상품 비교",
    heroDescription: "LG유플러스의 상품, 혜택, 요금을 직접 확인하고 비교해보세요.",
    featurePoints: ["U+tv", "IoT결합", "알뜰요금", "WiFi6"],
    status: "published",
    sortOrder: 30
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    slug: "skylife",
    name: "KT스카이라이프",
    shortName: "스카이라이프",
    summary: "위성TV 기반 전국 어디서나 설치 가능한 방송 서비스",
    heroTitle: "KT스카이라이프 인터넷/TV 상품 비교",
    heroDescription: "KT스카이라이프의 상품, 혜택, 요금을 직접 확인하고 비교해보세요.",
    featurePoints: ["위성TV", "전국설치", "저렴한 요금", "다채널"],
    status: "published",
    sortOrder: 40
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    slug: "hellovision",
    name: "LG헬로비전",
    shortName: "헬로비전",
    summary: "지역 케이블 기반 합리적인 가격의 인터넷/TV",
    heroTitle: "LG헬로비전 인터넷/TV 상품 비교",
    heroDescription: "LG헬로비전의 상품, 혜택, 요금을 직접 확인하고 비교해보세요.",
    featurePoints: ["케이블TV", "합리적 요금", "지역밀착", "빠른설치"],
    status: "published",
    sortOrder: 50
  }
];

export const productsSeed: Product[] = [
  // SK Products
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    carrierId: "11111111-1111-1111-1111-111111111111",
    slug: "sk-giga-500-btv-all",
    name: "기가라이트 500M + B tv ALL",
    summary: "SK 대표 결합상품, 257채널 + 500M 인터넷",
    description: "가족 단위에 가장 인기 있는 SK브로드밴드 대표 결합 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "500M",
    tvIncluded: true,
    monthlyPriceLabel: "39,400원",
    benefitLabel: "사은품 최대 33만원",
    badgeTags: ["인기", "추천"],
    targetTags: ["가족", "TV포함", "결합"],
    heroPoints: ["500M 인터넷", "B tv ALL 257ch", "가족결합 추가할인"],
    detailSections: [
      { title: "추천 대상", body: "TV 시청이 많은 가족 단위 가구에 적합합니다." },
      { title: "결합 혜택", body: "휴대폰 결합 시 인터넷 요금 추가 할인이 적용됩니다." }
    ],
    faqItems: [
      { q: "약정 기간은 어떻게 되나요?", a: "3년 약정 기준이며, 약정 내 해지 시 위약금이 발생합니다." },
      { q: "설치비가 있나요?", a: "신규 가입 시 설치비는 무료입니다." }
    ],
    isFeatured: true,
    status: "published",
    sortOrder: 10
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab",
    carrierId: "11111111-1111-1111-1111-111111111111",
    slug: "sk-giga-1g-btv-standard",
    name: "기가프리미엄 1G + B tv 스탠다드",
    summary: "최고 속도 1G + 234채널 프리미엄 구성",
    description: "고속 인터넷과 풍부한 채널을 원하는 고객을 위한 프리미엄 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "1G",
    tvIncluded: true,
    monthlyPriceLabel: "49,500원",
    benefitLabel: "사은품 최대 40만원",
    badgeTags: ["프리미엄", "1G"],
    targetTags: ["고속", "프리미엄", "재택"],
    heroPoints: ["1G 초고속 인터넷", "B tv 스탠다드 234ch", "Wi-Fi 6 공유기 제공"],
    detailSections: [
      { title: "추천 대상", body: "재택근무, 게임, 고화질 스트리밍을 즐기는 가구에 적합합니다." }
    ],
    faqItems: [
      { q: "실제 속도는 얼마나 나오나요?", a: "환경에 따라 다르지만 유선 기준 800~900Mbps 수준입니다." }
    ],
    isFeatured: false,
    status: "published",
    sortOrder: 15
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac",
    carrierId: "11111111-1111-1111-1111-111111111111",
    slug: "sk-giga-100-internet",
    name: "기가라이트 100M 인터넷",
    summary: "인터넷만 필요한 분을 위한 실속형 단독 상품",
    description: "TV 없이 인터넷만 사용하는 1인 가구에 적합합니다.",
    bundleType: "internet_only",
    internetSpeed: "100M",
    tvIncluded: false,
    monthlyPriceLabel: "22,000원",
    benefitLabel: "사은품 최대 15만원",
    badgeTags: ["실속형"],
    targetTags: ["1인가구", "인터넷단독"],
    heroPoints: ["100M 기본 인터넷", "TV 없이 단독 가입", "저렴한 월 요금"],
    detailSections: [
      { title: "추천 대상", body: "웹서핑, 영상 시청 위주의 1인 가구에 적합합니다." }
    ],
    faqItems: [],
    isFeatured: false,
    status: "published",
    sortOrder: 18
  },
  // KT Products
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    carrierId: "22222222-2222-2222-2222-222222222222",
    slug: "kt-500-tv-basic",
    name: "KT 슬림 500M + 올레tv 베이직",
    summary: "KT 대표 결합상품, 안정적인 품질과 합리적 가격",
    description: "안정적인 KT 인터넷과 올레tv의 대표 결합 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "500M",
    tvIncluded: true,
    monthlyPriceLabel: "39,600원",
    benefitLabel: "사은품 최대 35만원",
    badgeTags: ["인기", "안정적"],
    targetTags: ["가족", "TV포함", "안정성"],
    heroPoints: ["500M 인터넷", "올레tv 베이직", "KT 결합할인"],
    detailSections: [
      { title: "추천 대상", body: "안정적인 인터넷 품질을 원하는 가족 가구에 적합합니다." },
      { title: "결합 혜택", body: "KT 휴대폰 사용자는 추가 결합 할인을 받을 수 있습니다." }
    ],
    faqItems: [
      { q: "KT 휴대폰이 아니어도 가입 가능한가요?", a: "네, 인터넷/TV만 단독 가입 가능합니다." }
    ],
    isFeatured: true,
    status: "published",
    sortOrder: 20
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbe",
    carrierId: "22222222-2222-2222-2222-222222222222",
    slug: "kt-1g-tv-premium",
    name: "KT 에센스 1G + 올레tv 프리미엄",
    summary: "최고급 인터넷 + 프리미엄 채널 패키지",
    description: "고속 인터넷과 최다 채널을 원하는 프리미엄 고객을 위한 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "1G",
    tvIncluded: true,
    monthlyPriceLabel: "55,000원",
    benefitLabel: "사은품 최대 45만원",
    badgeTags: ["프리미엄"],
    targetTags: ["프리미엄", "고속", "다채널"],
    heroPoints: ["1G 초고속", "올레tv 프리미엄", "VOD 무제한"],
    detailSections: [],
    faqItems: [],
    isFeatured: false,
    status: "published",
    sortOrder: 25
  },
  // LG Products
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    carrierId: "33333333-3333-3333-3333-333333333333",
    slug: "lg-500-utv-basic",
    name: "LG 500M + U+tv 베이직",
    summary: "실속형 요금에 WiFi6 공유기 포함 구성",
    description: "합리적인 가격에 WiFi6 공유기가 포함된 LG유플러스 대표 결합 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "500M",
    tvIncluded: true,
    monthlyPriceLabel: "34,100원",
    benefitLabel: "사은품 최대 30만원",
    badgeTags: ["실속형", "WiFi6"],
    targetTags: ["신혼", "WiFi포함", "실속"],
    heroPoints: ["500M 인터넷", "U+tv 베이직", "WiFi6 공유기 기본 제공"],
    detailSections: [
      { title: "추천 대상", body: "WiFi 포함 구성을 원하는 신혼/소규모 가구에 적합합니다." }
    ],
    faqItems: [
      { q: "WiFi 공유기가 무료인가요?", a: "약정 기간 중 WiFi6 공유기가 무상 제공됩니다." }
    ],
    isFeatured: true,
    status: "published",
    sortOrder: 30
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccf",
    carrierId: "33333333-3333-3333-3333-333333333333",
    slug: "lg-1g-utv-premium",
    name: "LG 1G + U+tv 프리미엄",
    summary: "초고속 인터넷 + 프리미엄 채널 구성",
    description: "최고 속도와 다양한 채널을 원하는 고객을 위한 프리미엄 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "1G",
    tvIncluded: true,
    monthlyPriceLabel: "48,400원",
    benefitLabel: "사은품 최대 38만원",
    badgeTags: ["프리미엄", "1G"],
    targetTags: ["프리미엄", "고속"],
    heroPoints: ["1G 초고속", "U+tv 프리미엄", "AI 스피커 결합"],
    detailSections: [],
    faqItems: [],
    isFeatured: false,
    status: "published",
    sortOrder: 35
  },
  // Skylife
  {
    id: "dddddddd-1111-1111-1111-111111111111",
    carrierId: "44444444-4444-4444-4444-444444444444",
    slug: "skylife-100-sky-all",
    name: "스카이라이프 100M + SKY ALL",
    summary: "위성TV 기반 전국 설치, 다채널 패키지",
    description: "전국 어디서나 설치 가능한 위성TV 기반 인터넷/TV 결합 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "100M",
    tvIncluded: true,
    monthlyPriceLabel: "30,800원",
    benefitLabel: "사은품 최대 25만원",
    badgeTags: ["전국설치", "위성TV"],
    targetTags: ["전국", "저렴", "다채널"],
    heroPoints: ["100M 인터넷", "SKY ALL 패키지", "전국 어디서나 설치"],
    detailSections: [
      { title: "추천 대상", body: "케이블 미설치 지역이나 위성TV를 선호하는 가구에 적합합니다." }
    ],
    faqItems: [
      { q: "아파트에서도 설치 가능한가요?", a: "네, 위성 안테나 설치가 가능한 환경이면 가능합니다." }
    ],
    isFeatured: true,
    status: "published",
    sortOrder: 40
  },
  // Hello Vision
  {
    id: "eeeeeeee-1111-1111-1111-111111111111",
    carrierId: "55555555-5555-5555-5555-555555555555",
    slug: "hello-100-tv-economy",
    name: "헬로비전 100M + TV 이코노미",
    summary: "합리적인 가격의 케이블TV + 인터넷 결합",
    description: "지역 케이블 기반으로 저렴한 가격에 인터넷과 TV를 이용할 수 있습니다.",
    bundleType: "internet_tv",
    internetSpeed: "100M",
    tvIncluded: true,
    monthlyPriceLabel: "29,530원",
    benefitLabel: "사은품 최대 20만원",
    badgeTags: ["최저가", "케이블"],
    targetTags: ["저렴", "실속", "지역케이블"],
    heroPoints: ["100M 인터넷", "TV 이코노미 패키지", "월 3만원 미만"],
    detailSections: [
      { title: "추천 대상", body: "최저 비용으로 인터넷+TV를 이용하고 싶은 가구에 적합합니다." }
    ],
    faqItems: [],
    isFeatured: true,
    status: "published",
    sortOrder: 50
  }
];

export const postsSeed: Post[] = [
  {
    id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    type: "event",
    slug: "march-max-benefit",
    title: "3월 한정! 인터넷 가입 시 최대 혜택 지급",
    summary: "이번 달 가입 고객에게 사은품 최대 지원! 당일설치, 당일입금.",
    body: "3월 한정 프로모션으로 SK, KT, LG 전 통신사 인터넷 가입 시 최대 사은품을 지급합니다. 당일 설치, 당일 입금으로 빠르게 혜택을 받으세요.",
    ctaLabel: "혜택 확인하기",
    relatedProductSlugs: ["sk-giga-500-btv-all", "kt-500-tv-basic"],
    isFeatured: true,
    publishedAt: "2026-03-01T09:00:00.000Z",
    status: "published"
  },
  {
    id: "dddddddd-dddd-dddd-dddd-ddddddddddde",
    type: "event",
    slug: "family-bundle-special",
    title: "가족결합 특별 할인 이벤트",
    summary: "가족 휴대폰과 인터넷 결합 시 추가 할인 혜택을 드립니다.",
    body: "가족 구성원의 휴대폰과 인터넷을 함께 결합하면 매월 추가 할인이 적용됩니다. 결합 회선이 많을수록 할인 폭이 커집니다.",
    ctaLabel: "결합 문의하기",
    relatedProductSlugs: ["sk-giga-500-btv-all"],
    isFeatured: true,
    publishedAt: "2026-03-05T09:00:00.000Z",
    status: "published"
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    type: "guide",
    slug: "how-to-choose-speed",
    title: "인터넷 속도, 100M vs 500M vs 1G 뭘 골라야 할까?",
    summary: "우리 집에 맞는 인터넷 속도를 쉽게 선택하는 방법을 알려드립니다.",
    body: "인터넷 속도 선택은 가구 구성원 수, 동시 접속 기기 수, 주로 하는 활동에 따라 달라집니다. 1인 가구는 100M, 2~3인 가구는 500M, 4인 이상이나 재택근무가 많다면 1G를 추천합니다.",
    ctaLabel: "속도별 상품 비교",
    relatedProductSlugs: ["sk-giga-100-internet", "sk-giga-500-btv-all"],
    isFeatured: true,
    publishedAt: "2026-03-02T09:00:00.000Z",
    status: "published"
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeff",
    type: "guide",
    slug: "internet-tv-bundle-guide",
    title: "인터넷+TV 결합, 따로 가입하면 손해!",
    summary: "인터넷과 TV를 따로 가입하면 얼마나 손해인지 비교해드립니다.",
    body: "인터넷과 TV를 결합 가입하면 월 요금이 평균 1~2만원 절약됩니다. 통신사별 결합 할인 조건과 혜택을 비교해보세요.",
    ctaLabel: "결합 상품 보기",
    relatedProductSlugs: ["kt-500-tv-basic", "lg-500-utv-basic"],
    isFeatured: true,
    publishedAt: "2026-03-03T09:00:00.000Z",
    status: "published"
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeg1",
    type: "guide",
    slug: "moving-internet-checklist",
    title: "이사할 때 인터넷, 이전 vs 신규 어떤 게 유리할까?",
    summary: "이사 시 인터넷 이전과 신규 가입의 장단점을 비교합니다.",
    body: "이사 시 기존 인터넷을 이전하면 간편하지만, 신규 가입 시 사은품 혜택이 훨씬 큽니다. 약정 잔여 기간과 위약금을 비교해서 결정하세요.",
    ctaLabel: "이사 상담 받기",
    relatedProductSlugs: [],
    isFeatured: true,
    publishedAt: "2026-03-04T09:00:00.000Z",
    status: "published"
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeg2",
    type: "guide",
    slug: "contract-renewal-tips",
    title: "약정 만료됐다면? 재약정 vs 통신사 변경 비교",
    summary: "약정 만료 후 재약정과 통신사 변경 중 어떤 게 유리한지 알려드립니다.",
    body: "약정이 만료되면 재약정 혜택과 타 통신사 신규 가입 혜택을 비교해야 합니다. 일반적으로 통신사 변경 시 사은품이 더 크지만, 재약정도 할인 혜택이 있습니다.",
    ctaLabel: "비교 상담 받기",
    relatedProductSlugs: [],
    isFeatured: true,
    publishedAt: "2026-03-06T09:00:00.000Z",
    status: "published"
  },
  {
    id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
    type: "notice",
    slug: "site-open-notice",
    title: "인터넷공룡 사이트 오픈 안내",
    summary: "인터넷공룡 공식 사이트가 오픈되었습니다.",
    body: "인터넷공룡 공식 사이트를 방문해주셔서 감사합니다. 최대 혜택으로 인터넷/TV 상담을 도와드리겠습니다.",
    ctaLabel: "상담 신청",
    relatedProductSlugs: [],
    isFeatured: false,
    publishedAt: "2026-03-01T09:00:00.000Z",
    status: "published"
  }
];

export const reviewsSeed: Review[] = [
  {
    id: "12121212-1212-1212-1212-121212121212",
    slug: "fast-install-review",
    title: "신청 당일에 바로 설치해주셨어요",
    summary: "오전에 신청했는데 오후에 바로 기사님이 오셔서 설치해주셨습니다. 사은품도 당일 입금!",
    body: "이사 때문에 급하게 인터넷이 필요했는데, 인터넷공룡에서 상담받고 당일에 바로 설치 완료했습니다. 사은품도 약속대로 당일 입금해주셔서 만족합니다.",
    reviewType: "moving",
    tags: ["당일설치", "빠른상담", "사은품"],
    featured: true,
    publishedAt: "2026-03-08T09:00:00.000Z",
    status: "published"
  },
  {
    id: "34343434-3434-3434-3434-343434343434",
    slug: "family-bundle-satisfied",
    title: "가족결합으로 매달 2만원 절약하고 있어요",
    summary: "4인 가족 휴대폰과 인터넷을 결합하니 할인이 꽤 크더라구요.",
    body: "기존에 따로따로 쓰고 있었는데, 가족결합으로 묶으니 매달 2만원 이상 절약되고 있습니다. 상담사분이 꼼꼼하게 비교해주셔서 좋았어요.",
    reviewType: "bundle",
    tags: ["가족결합", "절약", "상담만족"],
    featured: true,
    publishedAt: "2026-03-07T09:00:00.000Z",
    status: "published"
  },
  {
    id: "34343434-3434-3434-3434-343434343435",
    slug: "renewal-benefit-review",
    title: "재약정보다 통신사 변경이 훨씬 이득이었어요",
    summary: "약정 만료 후 상담받았는데 통신사 변경 시 사은품이 3배 차이 났습니다.",
    body: "3년 약정이 끝나서 재약정하려고 했는데, 상담사분이 통신사 변경 시 혜택을 비교해주셨어요. 사은품 차이가 커서 변경했는데 만족합니다.",
    reviewType: "renewal",
    tags: ["약정만료", "통신사변경", "사은품"],
    featured: true,
    publishedAt: "2026-03-06T09:00:00.000Z",
    status: "published"
  },
  {
    id: "34343434-3434-3434-3434-343434343436",
    slug: "one-person-internet-review",
    title: "1인 가구인데 월 2만원대로 인터넷 쓰고 있어요",
    summary: "혼자 사는데 100M이면 충분하고 가격도 저렴해서 만족합니다.",
    body: "자취방에서 넷플릭스랑 유튜브만 보는데 100M으로도 충분합니다. 월 2만원대라 부담없고 설치도 빨랐어요.",
    reviewType: "internet_only",
    tags: ["1인가구", "실속형", "100M"],
    featured: false,
    publishedAt: "2026-03-05T09:00:00.000Z",
    status: "published"
  }
];
