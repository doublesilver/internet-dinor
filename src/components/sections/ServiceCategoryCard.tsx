import Link from "next/link";

interface ServiceCategoryCardProps {
  icon: string;
  title: string;
  maxAmount: string;
  href: string;
}

const categoryData: ServiceCategoryCardProps[] = [
  { icon: "🌐", title: "인터넷만", maxAmount: "최대 33만원", href: "/compare?bundle=internet_only" },
  { icon: "📺", title: "인터넷 + TV", maxAmount: "최대 47만원", href: "/compare?bundle=internet_tv" },
  { icon: "📱", title: "인터넷 + TV + 알뜰폰", maxAmount: "최대 80만원", href: "/compare" },
  { icon: "🏠", title: "인터넷 + TV + 렌탈", maxAmount: "최대 90만원", href: "/compare" },
  { icon: "📡", title: "인터넷 + TV + 휴대폰", maxAmount: "최대 120만원", href: "/compare" }
];

export function ServiceCategoryCards() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {categoryData.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="group flex flex-col items-center gap-3 rounded-2xl border border-brand-border bg-white p-6 text-center transition hover:border-brand-orange hover:shadow-soft"
        >
          <span className="text-4xl">{item.icon}</span>
          <h3 className="text-sm font-bold text-brand-graphite">{item.title}</h3>
          <p className="text-lg font-black text-brand-orange">{item.maxAmount}</p>
        </Link>
      ))}
    </div>
  );
}
