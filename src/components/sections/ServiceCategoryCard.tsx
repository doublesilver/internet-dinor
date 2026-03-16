import Link from "next/link";

interface CategoryItem {
  title: string;
  subTitle: string;
  maxAmount: string;
  quickHref: string;
  applyHref: string;
}

const categoryData: CategoryItem[] = [
  {
    title: "인터넷 단독 가입",
    subTitle: "20/30 자취생들의 One pick!",
    maxAmount: "최대 33만원 + α",
    quickHref: "/apply?bundle=internet_only&quick=1",
    applyHref: "/apply?bundle=internet_only"
  },
  {
    title: "인터넷 + TV 가입",
    subTitle: "신혼부부, 가족에게 추천! 집에서 최신 OTT 보자!",
    maxAmount: "최대 47만원 + α",
    quickHref: "/apply?bundle=internet_tv&quick=1",
    applyHref: "/apply?bundle=internet_tv"
  },
  {
    title: "인터넷 + TV + 유심(통신사이동) 가입",
    subTitle: "인터넷 가입도 알뜰하게! 결합할인에 최대 사은품까지!",
    maxAmount: "최대 80만원 + α",
    quickHref: "/apply?bundle=internet_tv_usim&quick=1",
    applyHref: "/apply?bundle=internet_tv_usim"
  },
  {
    title: "인터넷 + TV + 렌탈 가입",
    subTitle: "신혼부부, 이사, 노후를 위해 렌탈 추가시 사은품도 추가!",
    maxAmount: "최대 90만원 + α",
    quickHref: "/apply?bundle=internet_tv_rental&quick=1",
    applyHref: "/apply?bundle=internet_tv_rental"
  },
  {
    title: "인터넷 + TV + 휴대폰 가입",
    subTitle: "가장 HOT한 혜택! 현금 가입 즉시 지급!",
    maxAmount: "최대 120만원 + α",
    quickHref: "/apply?bundle=internet_tv_mobile&quick=1",
    applyHref: "/apply?bundle=internet_tv_mobile"
  }
];

export function ServiceCategoryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {categoryData.map((item) => (
        <div
          key={item.title}
          className="flex flex-col rounded-[20px] bg-white shadow-[4px_4px_2px_rgba(0,0,0,0.1)]"
        >
          {/* Card body */}
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-5 text-center">
            <h3 className="text-base font-black leading-tight text-gray-900">{item.title}</h3>
            <p className="text-xs text-gray-500 leading-snug">{item.subTitle}</p>
            <p className="mt-2 text-xl font-black text-brand-orange">{item.maxAmount}</p>
          </div>

          {/* CTA buttons */}
          <div className="flex overflow-hidden rounded-b-[20px]">
            <Link
              href={item.quickHref}
              className="flex-1 bg-brand-orange py-3 text-center text-sm font-bold text-white hover:opacity-90"
            >
              빠른견적
            </Link>
            <Link
              href={item.applyHref}
              className="flex-1 border-l border-white/20 bg-brand-orange py-3 text-center text-sm font-bold text-white hover:opacity-90"
            >
              신청서 작성
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
