import type { Carrier, Post, Product, Review, SiteSettings } from "@/types/domain";

export const siteSettingsSeed: SiteSettings = {
  siteName: "인터넷공룡",
  phoneLabel: "1544-2825",
  phoneLink: "tel:15442825",
  heroCtaLabel: "최대 지원금 확인",
  secondaryCtaLabel: "전화 상담",
  footerNotice: "인터넷공룡은 통신사 공식 판매점으로 안전하고 빠른 상담을 제공합니다.",
  businessInfo: {
    owner: "장윤성",
    businessNumber: "427-31-02018",
    ecommerceNumber: "제 2026-3820239-30-2-00209 호",
    address: "경기도 의정부시 호국로1346번길 125, 2층 207호 (의정부동)",
    email: "ititdragon@gmail.com"
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
    slug: "sk-500-btv-all",
    name: "기가라이트인터넷 500M + B tv ALL",
    summary: "Giga찬 인터넷 속도와 B tv 모든 채널을 한번에!",
    description: "가족 단위에 가장 인기 있는 SK브로드밴드 대표 결합 상품입니다. 500M 인터넷과 B tv ALL 257개 채널을 합리적인 가격에 이용하세요.",
    bundleType: "internet_tv",
    internetSpeed: "500M",
    tvIncluded: true,
    monthlyPriceLabel: "39,400원",
    benefitLabel: "사은품 최대 47만원",
    badgeTags: ["인기", "추천"],
    targetTags: ["가족", "TV포함", "결합"],
    heroPoints: ["500M 인터넷", "B tv ALL 257ch", "가족결합 추가할인"],
    detailSections: [
      { title: "추천 대상", body: "TV 시청이 많은 가족 단위 가구에 적합합니다. B tv ALL로 257개 채널을 마음껏 즐기세요." },
      { title: "결합 혜택", body: "휴대폰 결합 시 인터넷 요금 추가 할인이 적용됩니다. 가족 회선이 많을수록 할인 폭이 커집니다." }
    ],
    faqItems: [
      { q: "약정 기간은 어떻게 되나요?", a: "3년 약정 기준이며, 약정 내 해지 시 위약금이 발생합니다." },
      { q: "설치비가 있나요?", a: "신규 가입 시 설치비는 무료입니다." },
      { q: "B tv ALL에는 어떤 채널이 포함되나요?", a: "지상파, 케이블, 종편 등 총 257개 채널이 포함됩니다." }
    ],
    isFeatured: true,
    status: "published",
    sortOrder: 10
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab",
    carrierId: "11111111-1111-1111-1111-111111111111",
    slug: "sk-1g-btv-all",
    name: "기가인터넷 1G + B tv ALL",
    summary: "WiFi에 날개를 달아 집안 구석구석 끊김없이!",
    description: "최고 속도 1G 인터넷과 B tv ALL 257채널을 함께 이용할 수 있는 프리미엄 결합 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "1G",
    tvIncluded: true,
    monthlyPriceLabel: "41,600원",
    benefitLabel: "사은품 최대 50만원",
    badgeTags: ["프리미엄", "1G"],
    targetTags: ["고속", "프리미엄", "재택"],
    heroPoints: ["1G 초고속 인터넷", "B tv ALL 257ch", "Wi-Fi 6 공유기 제공"],
    detailSections: [
      { title: "추천 대상", body: "재택근무, 고화질 게임, 4K 스트리밍을 즐기는 가구에 적합합니다." },
      { title: "속도 안내", body: "유선 기준 최대 1Gbps 속도로 여러 기기를 동시에 사용해도 끊김이 없습니다." }
    ],
    faqItems: [
      { q: "실제 속도는 얼마나 나오나요?", a: "환경에 따라 다르지만 유선 기준 800~900Mbps 수준입니다." },
      { q: "Wi-Fi 6 공유기가 포함되나요?", a: "네, 약정 기간 중 Wi-Fi 6 공유기가 무상 제공됩니다." }
    ],
    isFeatured: false,
    status: "published",
    sortOrder: 12
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac",
    carrierId: "11111111-1111-1111-1111-111111111111",
    slug: "sk-100-btv-standard",
    name: "광랜인터넷 100M + B tv 스탠다드",
    summary: "갓성비추구! 실속파 고객님을 위한 맞춤형 상품!",
    description: "합리적인 가격으로 인터넷과 TV를 함께 이용할 수 있는 실속형 결합 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "100M",
    tvIncluded: true,
    monthlyPriceLabel: "31,700원",
    benefitLabel: "사은품 최대 33만원",
    badgeTags: ["실속형"],
    targetTags: ["1인가구", "실속", "저렴"],
    heroPoints: ["100M 인터넷", "B tv 스탠다드", "저렴한 월 요금"],
    detailSections: [
      { title: "추천 대상", body: "웹서핑, 영상 시청 위주의 1~2인 가구에 적합합니다. TV 채널도 기본 패키지로 충분히 즐길 수 있습니다." }
    ],
    faqItems: [
      { q: "B tv 스탠다드에는 몇 개 채널이 있나요?", a: "약 234개 채널이 포함되어 있습니다." },
      { q: "나중에 속도 업그레이드가 가능한가요?", a: "약정 중에도 업그레이드 상담이 가능합니다. 고객센터로 문의해주세요." }
    ],
    isFeatured: false,
    status: "published",
    sortOrder: 14
  },
  // KT Products
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    carrierId: "22222222-2222-2222-2222-222222222222",
    slug: "kt-500-otv-basic",
    name: "인터넷 베이직 500M + OTV 베이직",
    summary: "빠른 인터넷속도로 영상은 끊김없이, 인기 채널 모두 담은!",
    description: "안정적인 KT 인터넷과 OTV 베이직 채널 패키지를 합리적인 가격에 이용할 수 있는 대표 결합 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "500M",
    tvIncluded: true,
    monthlyPriceLabel: "39,600원",
    benefitLabel: "사은품 최대 45만원",
    badgeTags: ["인기", "안정적"],
    targetTags: ["가족", "TV포함", "안정성"],
    heroPoints: ["500M 인터넷", "OTV 베이직", "KT 결합할인"],
    detailSections: [
      { title: "추천 대상", body: "안정적인 인터넷 품질을 원하는 가족 가구에 적합합니다. KT의 전국 최대 커버리지로 끊김 없이 이용하세요." },
      { title: "결합 혜택", body: "KT 휴대폰 사용자는 추가 결합 할인을 받을 수 있습니다. 결합 회선 수에 따라 할인 폭이 커집니다." }
    ],
    faqItems: [
      { q: "KT 휴대폰이 아니어도 가입 가능한가요?", a: "네, 인터넷/TV만 단독 가입 가능합니다." },
      { q: "OTV 베이직 채널 수는 얼마나 되나요?", a: "약 200여 개 채널이 포함되어 있습니다." }
    ],
    isFeatured: true,
    status: "published",
    sortOrder: 20
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbe",
    carrierId: "22222222-2222-2222-2222-222222222222",
    slug: "kt-1g-otv-essence",
    name: "인터넷 에센스 1G + OTV 에센스",
    summary: "게임도 해야하고 VOD 콘텐츠도 많이 보는!",
    description: "초고속 1G 인터넷과 OTV 에센스 채널 패키지를 결합한 프리미엄 상품입니다. 게임과 고화질 스트리밍을 즐기는 고객에게 최적입니다.",
    bundleType: "internet_tv",
    internetSpeed: "1G",
    tvIncluded: true,
    monthlyPriceLabel: "48,400원",
    benefitLabel: "사은품 최대 50만원",
    badgeTags: ["프리미엄", "1G"],
    targetTags: ["프리미엄", "고속", "게임", "VOD"],
    heroPoints: ["1G 초고속 인터넷", "OTV 에센스", "VOD 무제한"],
    detailSections: [
      { title: "추천 대상", body: "온라인 게임, 4K 영상, VOD를 많이 시청하는 가구에 적합합니다." },
      { title: "속도 안내", body: "1G 인터넷으로 여러 기기를 동시에 사용해도 끊김 없이 즐길 수 있습니다." }
    ],
    faqItems: [
      { q: "OTV 에센스와 베이직의 차이는 무엇인가요?", a: "에센스는 베이직 대비 더 많은 채널과 VOD 콘텐츠가 포함되어 있습니다." },
      { q: "1G 인터넷 실측 속도는 얼마나 되나요?", a: "유선 기준 800~950Mbps 수준으로 제공됩니다." }
    ],
    isFeatured: false,
    status: "published",
    sortOrder: 22
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc",
    carrierId: "22222222-2222-2222-2222-222222222222",
    slug: "kt-100-otv-basic",
    name: "인터넷 슬림 100M + OTV 베이직",
    summary: "1인 가구 최적 상품! 요금은 경제적! 알뜰 조합 상품",
    description: "1인 가구를 위한 경제적인 인터넷+TV 결합 상품입니다. 기본에 충실한 구성으로 합리적인 가격을 제공합니다.",
    bundleType: "internet_tv",
    internetSpeed: "100M",
    tvIncluded: true,
    monthlyPriceLabel: "39,600원",
    benefitLabel: "사은품 최대 35만원",
    badgeTags: ["실속형", "1인가구"],
    targetTags: ["1인가구", "실속", "저렴"],
    heroPoints: ["100M 인터넷", "OTV 베이직", "1인 가구 최적"],
    detailSections: [
      { title: "추천 대상", body: "혼자 사는 1인 가구 또는 인터넷 사용량이 적은 가구에 적합합니다." }
    ],
    faqItems: [
      { q: "1인 가구에 100M으로 충분한가요?", a: "넷플릭스, 유튜브, 웹서핑 등 일반적인 사용에는 100M으로 충분합니다." }
    ],
    isFeatured: false,
    status: "published",
    sortOrder: 24
  },
  // LG Products
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    carrierId: "33333333-3333-3333-3333-333333333333",
    slug: "lg-500-tv-basic",
    name: "와이파이기본 500M + TV 베이직",
    summary: "영상은 끊김없이 인기 채널 모두 담은!",
    description: "합리적인 가격에 WiFi6 공유기가 포함된 LG유플러스 대표 결합 상품입니다. 500M 인터넷과 TV 베이직 채널을 함께 이용하세요.",
    bundleType: "internet_tv",
    internetSpeed: "500M",
    tvIncluded: true,
    monthlyPriceLabel: "34,100원",
    benefitLabel: "사은품 최대 47만원",
    badgeTags: ["인기", "WiFi6"],
    targetTags: ["신혼", "WiFi포함", "실속"],
    heroPoints: ["500M 인터넷", "TV 베이직", "WiFi6 공유기 기본 제공"],
    detailSections: [
      { title: "추천 대상", body: "WiFi 포함 구성을 원하는 신혼/소규모 가구에 적합합니다. WiFi6 공유기로 빠른 무선 인터넷을 즐기세요." },
      { title: "WiFi6 공유기", body: "약정 기간 중 최신 WiFi6 공유기가 무상으로 제공됩니다." }
    ],
    faqItems: [
      { q: "WiFi 공유기가 무료인가요?", a: "약정 기간 중 WiFi6 공유기가 무상 제공됩니다." },
      { q: "TV 베이직 채널 수는 얼마나 되나요?", a: "약 180여 개 채널이 포함되어 있습니다." }
    ],
    isFeatured: true,
    status: "published",
    sortOrder: 30
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccf",
    carrierId: "33333333-3333-3333-3333-333333333333",
    slug: "lg-500-premium-tv",
    name: "프리미엄안심 500M + TV 베이직",
    summary: "고화질 영화와 게임도 끊김없이!",
    description: "프리미엄 안심 보장 서비스와 함께하는 LG유플러스 500M 인터넷+TV 결합 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "500M",
    tvIncluded: true,
    monthlyPriceLabel: "38,500원",
    benefitLabel: "사은품 최대 42만원",
    badgeTags: ["프리미엄"],
    targetTags: ["프리미엄", "안심", "고화질"],
    heroPoints: ["500M 인터넷", "TV 베이직", "프리미엄 안심 보장"],
    detailSections: [
      { title: "추천 대상", body: "안정적인 인터넷 품질과 프리미엄 서비스를 원하는 가구에 적합합니다." }
    ],
    faqItems: [
      { q: "프리미엄 안심 서비스란 무엇인가요?", a: "장애 발생 시 우선 처리 및 추가 보상 서비스가 포함됩니다." }
    ],
    isFeatured: false,
    status: "published",
    sortOrder: 32
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccd",
    carrierId: "33333333-3333-3333-3333-333333333333",
    slug: "lg-1g-tv-premium",
    name: "와이파이기본 1G + TV 프리미엄",
    summary: "고사양 게임을 가장 빠르게!",
    description: "초고속 1G 인터넷과 TV 프리미엄 채널 패키지를 결합한 LG유플러스 최고급 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "1G",
    tvIncluded: true,
    monthlyPriceLabel: "40,700원",
    benefitLabel: "사은품 최대 50만원",
    badgeTags: ["1G", "프리미엄"],
    targetTags: ["프리미엄", "고속", "게임"],
    heroPoints: ["1G 초고속 인터넷", "TV 프리미엄", "WiFi6 공유기 기본 제공"],
    detailSections: [
      { title: "추천 대상", body: "고사양 온라인 게임, 4K 스트리밍을 즐기는 가구에 최적입니다." },
      { title: "속도 안내", body: "1G 인터넷으로 집안 어디서나 끊김 없는 초고속 인터넷을 즐기세요." }
    ],
    faqItems: [
      { q: "TV 프리미엄에는 어떤 채널이 포함되나요?", a: "지상파, 종편, 케이블, 스포츠, 영화 등 250개 이상의 채널이 포함됩니다." },
      { q: "게임 전용 최적화가 있나요?", a: "LG유플러스 1G 인터넷은 저지연 최적화로 게임 환경에 유리합니다." }
    ],
    isFeatured: false,
    status: "published",
    sortOrder: 34
  },
  // Skylife Products
  {
    id: "dddddddd-1111-1111-1111-111111111111",
    carrierId: "44444444-4444-4444-4444-444444444444",
    slug: "sky-100-all",
    name: "인터넷 100M + SKY ALL",
    summary: "저렴한 가격! 빠른 속도! 모든 채널을 가장 저렴하게!",
    description: "전국 어디서나 설치 가능한 위성TV 기반 인터넷/TV 결합 상품입니다. 케이블이 없는 지역에서도 이용 가능합니다.",
    bundleType: "internet_tv",
    internetSpeed: "100M",
    tvIncluded: true,
    monthlyPriceLabel: "22,000원",
    benefitLabel: "사은품 최대 35만원",
    badgeTags: ["최저가", "전국설치"],
    targetTags: ["전국", "저렴", "다채널"],
    heroPoints: ["100M 인터넷", "SKY ALL 패키지", "전국 어디서나 설치"],
    detailSections: [
      { title: "추천 대상", body: "케이블 미설치 지역이나 위성TV를 선호하는 가구에 적합합니다. 전국 어디서나 설치 가능합니다." },
      { title: "SKY ALL 안내", body: "지상파부터 영화, 스포츠, 어린이 채널까지 모든 채널을 한 번에 이용하세요." }
    ],
    faqItems: [
      { q: "아파트에서도 설치 가능한가요?", a: "네, 위성 안테나 설치가 가능한 환경이면 가능합니다." },
      { q: "인터넷이 없는 지역에서도 TV 이용이 가능한가요?", a: "위성TV는 인터넷 환경과 무관하게 전국 어디서나 이용 가능합니다." }
    ],
    isFeatured: true,
    status: "published",
    sortOrder: 40
  },
  {
    id: "dddddddd-2222-2222-2222-222222222222",
    carrierId: "44444444-4444-4444-4444-444444444444",
    slug: "sky-500-all",
    name: "인터넷 500M + SKY ALL",
    summary: "안전한 이용 환경! 합리적인 500M 인터넷! 스마트한 TV 생활!",
    description: "500M 고속 인터넷과 스카이라이프 SKY ALL 채널 패키지를 결합한 추천 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "500M",
    tvIncluded: true,
    monthlyPriceLabel: "37,400원",
    benefitLabel: "사은품 최대 40만원",
    badgeTags: ["추천"],
    targetTags: ["가족", "TV포함", "500M"],
    heroPoints: ["500M 인터넷", "SKY ALL 패키지", "전국 어디서나 설치"],
    detailSections: [
      { title: "추천 대상", body: "빠른 인터넷과 다양한 TV 채널을 원하는 가족 가구에 적합합니다." }
    ],
    faqItems: [
      { q: "500M 인터넷도 전국 설치가 가능한가요?", a: "네, 스카이라이프 서비스 지역 내 전국 설치가 가능합니다." }
    ],
    isFeatured: false,
    status: "published",
    sortOrder: 42
  },
  {
    id: "dddddddd-3333-3333-3333-333333333333",
    carrierId: "44444444-4444-4444-4444-444444444444",
    slug: "sky-200-all",
    name: "인터넷 200M + SKY ALL",
    summary: "2배 빠른 인터넷, sky 200M 인터넷",
    description: "200M 인터넷과 스카이라이프 SKY ALL 채널을 가성비 좋게 이용할 수 있는 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "200M",
    tvIncluded: true,
    monthlyPriceLabel: "23,100원",
    benefitLabel: "사은품 최대 35만원",
    badgeTags: ["가성비"],
    targetTags: ["가성비", "2인가구", "200M"],
    heroPoints: ["200M 인터넷", "SKY ALL 패키지", "가성비 최강"],
    detailSections: [
      { title: "추천 대상", body: "100M보다 빠른 인터넷을 원하지만 비용을 아끼고 싶은 가구에 적합합니다." }
    ],
    faqItems: [
      { q: "200M 인터넷이면 4K 영상도 볼 수 있나요?", a: "네, 200M으로도 4K 스트리밍을 충분히 즐길 수 있습니다." }
    ],
    isFeatured: false,
    status: "published",
    sortOrder: 44
  },
  // Internet Only Products
  {
    id: "ffffffff-0001-0001-0001-000000000001",
    carrierId: "11111111-1111-1111-1111-111111111111",
    slug: "sk-500-internet-only",
    name: "기가라이트인터넷 500M (단독)",
    summary: "TV 없이 인터넷만! 합리적인 단독 인터넷 요금제",
    description: "TV 결합 없이 인터넷만 단독으로 이용하는 SK브로드밴드 500M 상품입니다. 군더더기 없이 빠른 인터넷만 필요한 분께 최적입니다.",
    bundleType: "internet_only",
    internetSpeed: "500M",
    tvIncluded: false,
    monthlyPriceLabel: "29,700원",
    benefitLabel: "사은품 최대 30만원",
    badgeTags: ["인터넷단독", "실속"],
    targetTags: ["1인가구", "인터넷단독", "실속"],
    heroPoints: ["500M 인터넷 단독", "TV 없이 저렴하게", "빠른 설치"],
    detailSections: [
      { title: "추천 대상", body: "TV를 잘 보지 않는 1~2인 가구나 OTT 서비스만 이용하는 고객에게 적합합니다." }
    ],
    faqItems: [
      { q: "나중에 TV를 추가할 수 있나요?", a: "약정 중에도 TV 결합 상담이 가능합니다. 고객센터로 문의해주세요." }
    ],
    isFeatured: false,
    status: "published",
    sortOrder: 16
  },
  // Hellovision Products
  {
    id: "eeeeeeee-1111-1111-1111-111111111111",
    carrierId: "55555555-5555-5555-5555-555555555555",
    slug: "hello-100-economy",
    name: "광랜라이트 100M + TV 이코노미",
    summary: "실속파 고객님을 위한! 알뜰 결합상품!",
    description: "지역 케이블 기반으로 저렴한 가격에 인터넷과 TV를 이용할 수 있는 헬로비전 대표 실속 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "100M",
    tvIncluded: true,
    monthlyPriceLabel: "29,530원",
    benefitLabel: "사은품 최대 30만원",
    badgeTags: ["최저가", "케이블"],
    targetTags: ["저렴", "실속", "지역케이블"],
    heroPoints: ["100M 인터넷", "TV 이코노미 패키지", "월 3만원 미만"],
    detailSections: [
      { title: "추천 대상", body: "최저 비용으로 인터넷+TV를 이용하고 싶은 가구에 적합합니다. 지역 케이블 기반의 안정적인 서비스를 제공합니다." }
    ],
    faqItems: [
      { q: "헬로비전은 어느 지역에서 이용 가능한가요?", a: "LG헬로비전 서비스 지역 내에서 이용 가능합니다. 설치 전 지역 확인이 필요합니다." },
      { q: "TV 이코노미 채널 수는 얼마나 되나요?", a: "약 109개 채널이 포함되어 있습니다." }
    ],
    isFeatured: true,
    status: "published",
    sortOrder: 50
  },
  {
    id: "eeeeeeee-2222-2222-2222-222222222222",
    carrierId: "55555555-5555-5555-5555-555555555555",
    slug: "hello-500-basic",
    name: "기가라이트 500M + TV 뉴베이직",
    summary: "판매 1위! 가장 많은 고객님이 선택한 조합",
    description: "헬로비전에서 가장 많은 고객이 선택한 500M 인터넷+TV 뉴베이직 결합 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "500M",
    tvIncluded: true,
    monthlyPriceLabel: "38,390원",
    benefitLabel: "사은품 최대 35만원",
    badgeTags: ["인기", "판매1위"],
    targetTags: ["가족", "TV포함", "500M"],
    heroPoints: ["500M 인터넷", "TV 뉴베이직", "판매 1위 조합"],
    detailSections: [
      { title: "추천 대상", body: "가장 많은 고객이 선택한 조합으로, 인터넷과 TV를 균형 있게 이용하고 싶은 가구에 적합합니다." }
    ],
    faqItems: [
      { q: "TV 뉴베이직 채널 수는 얼마나 되나요?", a: "약 150개 이상의 채널이 포함되어 있습니다." }
    ],
    isFeatured: false,
    status: "published",
    sortOrder: 52
  },
  {
    id: "eeeeeeee-3333-3333-3333-333333333333",
    carrierId: "55555555-5555-5555-5555-555555555555",
    slug: "hello-500-economy",
    name: "기가라이트 500M + TV 이코노미",
    summary: "500M 인터넷 + 방송 109여개",
    description: "500M 인터넷과 109개 TV 채널을 합리적인 가격에 이용할 수 있는 헬로비전 추천 상품입니다.",
    bundleType: "internet_tv",
    internetSpeed: "500M",
    tvIncluded: true,
    monthlyPriceLabel: "36,190원",
    benefitLabel: "사은품 최대 33만원",
    badgeTags: ["추천"],
    targetTags: ["실속", "500M", "케이블"],
    heroPoints: ["500M 인터넷", "TV 이코노미 109채널", "합리적인 가격"],
    detailSections: [
      { title: "추천 대상", body: "빠른 인터넷 속도는 원하지만 TV 채널은 기본으로 충분한 가구에 적합합니다." }
    ],
    faqItems: [
      { q: "500M 이코노미와 500M 뉴베이직의 차이는 무엇인가요?", a: "TV 채널 수의 차이입니다. 이코노미는 109채널, 뉴베이직은 150채널 이상입니다." }
    ],
    isFeatured: false,
    status: "published",
    sortOrder: 54
  }
];

export const postsSeed: Post[] = [
  // Events
  {
    id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    type: "event",
    slug: "cash-benefit-event",
    title: "현금 사은품받자~",
    summary: "인터넷 가입 시 현금 사은품을 받을 수 있는 기회! 지금 바로 상담받으세요.",
    body: "인터넷 신규 가입 또는 통신사 변경 시 현금 사은품을 드립니다. 통신사별 사은품 금액이 다르니 지금 바로 상담을 통해 내게 맞는 최대 혜택을 확인하세요. 당일 입금으로 빠르게 사은품을 받을 수 있습니다.",
    ctaLabel: "사은품 확인하기",
    relatedProductSlugs: ["sk-500-btv-all", "kt-500-otv-basic", "lg-500-tv-basic"],
    isFeatured: true,
    publishedAt: "2026-03-01T09:00:00.000Z",
    status: "published"
  },
  {
    id: "dddddddd-dddd-dddd-dddd-ddddddddddde",
    type: "event",
    slug: "credit-card-event",
    title: "신용카드 사용하시나요?",
    summary: "제휴카드 결합 시 매월 추가 할인 혜택을 드립니다.",
    body: "통신사 제휴 신용카드를 함께 사용하면 매월 인터넷 요금에서 추가 할인을 받을 수 있습니다. 카드 종류에 따라 월 최대 1만원 이상 절약 가능합니다. 지금 상담을 통해 적합한 제휴카드를 확인해보세요.",
    ctaLabel: "카드 혜택 확인하기",
    relatedProductSlugs: ["sk-500-btv-all", "kt-500-otv-basic"],
    isFeatured: true,
    publishedAt: "2026-03-05T09:00:00.000Z",
    status: "published"
  },
  {
    id: "dddddddd-dddd-dddd-dddd-ddddddddddf0",
    type: "event",
    slug: "business-internet-event",
    title: "사업장, 소상공인 신청 인터넷",
    summary: "사업장 전용 인터넷 특가 프로모션! 빠른 설치와 안정적인 속도.",
    body: "소상공인 및 사업장을 위한 전용 인터넷 특가 프로모션을 진행 중입니다. 빠른 설치와 안정적인 속도로 업무 환경을 개선하세요. 사업자 등록증만 있으면 특별 혜택을 받을 수 있습니다.",
    ctaLabel: "사업장 상담 신청",
    relatedProductSlugs: ["kt-500-otv-basic", "sk-500-btv-all"],
    isFeatured: true,
    publishedAt: "2026-03-03T09:00:00.000Z",
    status: "published"
  },
  {
    id: "dddddddd-dddd-dddd-dddd-ddddddddddf1",
    type: "event",
    slug: "review-starbucks-event",
    title: "전 고객 대상 후기 이벤트",
    summary: "설치 후기 작성 시 스타벅스 기프티콘을 드립니다.",
    body: "인터넷 설치 완료 후 네이버 또는 카카오 후기를 작성해주시면 스타벅스 아메리카노 기프티콘을 드립니다. 솔직한 후기를 통해 더 많은 분들께 도움을 드리세요. 후기 작성 후 상담사에게 문의하시면 빠르게 지급해드립니다.",
    ctaLabel: "후기 이벤트 참여",
    relatedProductSlugs: [],
    isFeatured: true,
    publishedAt: "2026-03-10T09:00:00.000Z",
    status: "published"
  },
  // Tips/Guides
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    type: "guide",
    slug: "internet-house-intro",
    title: "인터넷 가입은 인터넷공룡에서!!",
    summary: "왜 인터넷공룡을 통해 가입해야 하는지 알려드립니다.",
    body: "인터넷공룡은 SK, KT, LG, 스카이라이프, 헬로비전 전 통신사 공식 판매점으로 한 곳에서 모든 상품을 비교할 수 있습니다. 최대 사은품과 당일 입금, 당일 설치 서비스를 제공하며, 가입 후에도 친절한 사후 서비스를 드립니다. 통신사에 직접 가입하는 것보다 훨씬 큰 혜택을 드립니다.",
    ctaLabel: "인터넷공룡 소개 보기",
    relatedProductSlugs: [],
    isFeatured: true,
    publishedAt: "2026-03-01T09:00:00.000Z",
    status: "published"
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeef1",
    type: "guide",
    slug: "lg-bundle-discount-guide",
    title: "LG유플러스 결합할인 완벽 가이드",
    summary: "LG유플러스 참 쉬운 가족결합 할인 조건과 혜택을 정리했습니다.",
    body: "LG유플러스 가족결합 할인은 인터넷과 휴대폰을 같은 통신사로 묶으면 매월 할인이 적용되는 서비스입니다. 결합 회선 수가 많을수록 할인 폭이 커지며, 최대 월 3만원 이상 절약할 수 있습니다. 가족 구성원 전원이 LG유플러스를 사용하면 가장 큰 혜택을 받을 수 있습니다.",
    ctaLabel: "결합 할인 상담",
    relatedProductSlugs: ["lg-500-tv-basic", "lg-500-premium-tv", "lg-1g-tv-premium"],
    isFeatured: true,
    publishedAt: "2026-03-02T09:00:00.000Z",
    status: "published"
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeef2",
    type: "guide",
    slug: "kt-bundle-discount-guide",
    title: "KT 결합할인 완벽 가이드",
    summary: "KT 총액 결합할인의 조건과 할인 금액을 한눈에 비교해보세요.",
    body: "KT 총액 결합할인은 인터넷, TV, 휴대폰을 묶어서 가입하면 월 요금을 일정 금액 할인해주는 서비스입니다. 결합 상품의 종류와 회선 수에 따라 할인 금액이 달라지며, 최대 월 2만원 이상 절약 가능합니다. 정확한 할인 금액은 상담을 통해 확인하세요.",
    ctaLabel: "KT 결합 상담",
    relatedProductSlugs: ["kt-500-otv-basic", "kt-1g-otv-essence", "kt-100-otv-basic"],
    isFeatured: true,
    publishedAt: "2026-03-03T09:00:00.000Z",
    status: "published"
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeef3",
    type: "guide",
    slug: "sk-bundle-discount-guide",
    title: "SK브로드밴드 결합할인 완벽 가이드",
    summary: "SK 요즘가족결합, 요즘우리집결합 할인을 쉽게 설명합니다.",
    body: "SK브로드밴드의 요즘가족결합과 요즘우리집결합은 인터넷, TV, 휴대폰을 묶어 할인받는 대표 결합 서비스입니다. 요즘가족결합은 가족 회선 수에 따라, 요즘우리집결합은 가구 내 기기 수에 따라 할인이 적용됩니다. 본인에게 맞는 결합 방식을 선택해 최대 혜택을 받으세요.",
    ctaLabel: "SK 결합 상담",
    relatedProductSlugs: ["sk-500-btv-all", "sk-1g-btv-all", "sk-100-btv-standard"],
    isFeatured: true,
    publishedAt: "2026-03-04T09:00:00.000Z",
    status: "published"
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeef4",
    type: "guide",
    slug: "new-vs-renewal",
    title: "신규가입 VS 재약정, 뭐가 더 유리할까?",
    summary: "약정 만료 후 재약정과 신규가입의 장단점을 비교 분석합니다.",
    body: "약정이 만료되면 재약정과 신규가입(통신사 변경) 중 하나를 선택해야 합니다. 일반적으로 신규 가입 시 사은품이 훨씬 크지만, 재약정도 안정적인 요금 유지와 간편한 절차라는 장점이 있습니다. 위약금과 사은품 금액을 비교해서 본인에게 유리한 방법을 선택하세요.",
    ctaLabel: "비교 상담 받기",
    relatedProductSlugs: [],
    isFeatured: true,
    publishedAt: "2026-03-06T09:00:00.000Z",
    status: "published"
  },
  // Notice
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
  },
  {
    id: "34343434-3434-3434-3434-343434343437",
    slug: "kt-switch-satisfied",
    title: "SK에서 KT로 갈아탔는데 사은품 차이가 엄청나네요",
    summary: "기존 통신사 약정 끝나고 KT로 변경했는데 사은품이 두 배 이상 차이 났어요.",
    body: "SK 3년 약정이 끝나서 KT로 갈아탔습니다. 상담사분이 두 통신사 혜택을 비교해주셔서 결정이 쉬웠어요. 사은품도 빠르게 입금해주셨습니다.",
    reviewType: "renewal",
    tags: ["통신사변경", "KT", "사은품"],
    featured: true,
    publishedAt: "2026-03-04T09:00:00.000Z",
    status: "published"
  },
  {
    id: "34343434-3434-3434-3434-343434343438",
    slug: "newlywed-bundle-review",
    title: "신혼집 인터넷+TV 한번에 해결했어요",
    summary: "결혼 준비하면서 인터넷이랑 TV 같이 알아봤는데 결합이 훨씬 저렴하더라구요.",
    body: "신혼집 이사하면서 인터넷이랑 TV를 따로 가입하려다가 결합 상품을 추천받았습니다. 월 1만원 이상 절약되고, 채널도 많아서 만족합니다. 설치도 이사 당일에 해주셨어요.",
    reviewType: "bundle",
    tags: ["신혼", "결합상품", "절약"],
    featured: true,
    publishedAt: "2026-03-03T09:00:00.000Z",
    status: "published"
  },
  {
    id: "34343434-3434-3434-3434-343434343439",
    slug: "business-internet-review",
    title: "사무실 인터넷 빠르게 설치해주셔서 감사합니다",
    summary: "사업장 오픈 전날 급하게 연락했는데 당일 설치 해주셨어요.",
    body: "가게 오픈 하루 전에 급하게 인터넷이 필요했습니다. 전화 상담 후 바로 기사님이 오셔서 설치해주셨고, 속도도 안정적입니다. 사업장 인터넷은 여기서 하세요.",
    reviewType: "internet_only",
    tags: ["사업장", "당일설치", "빠른상담"],
    featured: false,
    publishedAt: "2026-03-02T09:00:00.000Z",
    status: "published"
  },
  {
    id: "34343434-3434-3434-3434-34343434343a",
    slug: "skylife-review",
    title: "시골 부모님 댁에도 TV 설치가 되네요",
    summary: "케이블이 안 들어오는 지역이라 포기했었는데 스카이라이프로 해결됐어요.",
    body: "부모님 댁이 시골이라 케이블 TV가 안 됐는데, 스카이라이프 위성TV로 설치했습니다. 채널도 많고 화질도 좋아서 부모님이 좋아하세요. 인터넷도 같이 결합해서 할인받았습니다.",
    reviewType: "bundle",
    tags: ["스카이라이프", "시골", "위성TV"],
    featured: false,
    publishedAt: "2026-03-01T09:00:00.000Z",
    status: "published"
  },
  {
    id: "34343434-3434-3434-3434-34343434343b",
    slug: "lg-uplus-iot-review",
    title: "LG유플러스 IoT 결합이 생각보다 편하네요",
    summary: "AI스피커로 TV도 켜고 조명도 제어하니까 정말 스마트홈이 됐어요.",
    body: "인터넷 가입하면서 IoT 결합을 추천받았습니다. 처음엔 반신반의했는데 AI스피커로 TV 채널도 바꾸고, 조명도 제어하니까 너무 편합니다. 아이들도 좋아해요.",
    reviewType: "bundle",
    tags: ["LG유플러스", "IoT", "스마트홈"],
    featured: false,
    publishedAt: "2026-02-28T09:00:00.000Z",
    status: "published"
  },
  {
    id: "34343434-3434-3434-3434-34343434343c",
    slug: "hellovision-cable-review",
    title: "헬로비전 케이블 인터넷 설치했는데 가성비 최고네요",
    summary: "대기업 통신사보다 저렴하고 속도도 충분해서 만족합니다.",
    body: "KT에서 헬로비전으로 바꿨는데 요금이 눈에 띄게 저렴해졌습니다. 속도도 일상 사용에 충분하고, 지역 케이블이라 AS도 빠르게 와주십니다. 가성비를 중시하는 분들께 추천합니다.",
    reviewType: "renewal",
    tags: ["헬로비전", "가성비", "케이블"],
    featured: false,
    publishedAt: "2026-02-27T09:00:00.000Z",
    status: "published"
  }
];
