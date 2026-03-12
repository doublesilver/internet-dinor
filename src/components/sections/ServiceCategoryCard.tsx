import Link from "next/link";

interface CategoryItem {
  title: string;
  subTitle: string;
  maxAmount: string;
  href: string;
}

const categoryData: CategoryItem[] = [
  { title: "인터넷만", subTitle: "인터넷 단독 구성", maxAmount: "최대 33만원 + α", href: "/compare?bundle=internet_only" },
  { title: "인터넷 + TV", subTitle: "가장 인기있는 구성", maxAmount: "최대 47만원 + α", href: "/compare?bundle=internet_tv" },
  { title: "인터넷 + TV + 알뜰폰", subTitle: "유심변경으로 추가 혜택", maxAmount: "최대 80만원 + α", href: "/compare" },
  { title: "인터넷 + TV + 렌탈", subTitle: "렌탈 결합 추가 할인", maxAmount: "최대 90만원 + α", href: "/compare" },
  { title: "인터넷 + TV + 휴대폰", subTitle: "휴대폰 결합 최대 혜택", maxAmount: "최대 120만원 + α", href: "/compare" }
];

export function ServiceCategoryCards() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {categoryData.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="group flex flex-col items-center justify-center gap-2 rounded-[30px] bg-white px-4 py-10 text-center shadow-[4px_4px_2px_rgba(0,0,0,0.1)] transition hover:scale-[1.02]"
        >
          <h3 className="text-lg font-black leading-tight text-gray-900">{item.title}</h3>
          <p className="text-xs text-gray-500">{item.subTitle}</p>
          <p className="mt-2 text-xl font-black text-brand-orange">{item.maxAmount}</p>
        </Link>
      ))}
    </div>
  );
}
