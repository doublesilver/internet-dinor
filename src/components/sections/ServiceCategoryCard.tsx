import Link from "next/link";

interface CategoryItem {
  icon: string;
  title: string;
  maxAmount: string;
  href: string;
}

const categoryData: CategoryItem[] = [
  { icon: "🌐", title: "인터넷만", maxAmount: "최대 33만원", href: "/compare?bundle=internet_only" },
  { icon: "📺", title: "인터넷 + TV", maxAmount: "최대 47만원", href: "/compare?bundle=internet_tv" },
  { icon: "📱", title: "인터넷 + TV\n+ 알뜰폰", maxAmount: "최대 80만원", href: "/compare" },
  { icon: "🏠", title: "인터넷 + TV\n+ 렌탈", maxAmount: "최대 90만원", href: "/compare" },
  { icon: "📡", title: "인터넷 + TV\n+ 휴대폰", maxAmount: "최대 120만원", href: "/compare" }
];

export function ServiceCategoryCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {categoryData.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="group relative flex flex-col items-center gap-2 rounded-2xl border-2 border-brand-border bg-white px-4 py-8 text-center transition hover:border-brand-orange hover:shadow-soft"
        >
          <span className="text-5xl leading-none">{item.icon}</span>
          <h3 className="mt-1 whitespace-pre-line text-sm font-bold leading-tight text-brand-graphite">{item.title}</h3>
          <p className="mt-1 text-xl font-black text-brand-orange">{item.maxAmount}</p>
          <span className="mt-1 text-[11px] text-brand-slate">+ 추가 지원금</span>
        </Link>
      ))}
    </div>
  );
}
