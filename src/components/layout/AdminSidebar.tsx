"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { adminNavigation } from "@/lib/constants/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-full border-b border-brand-border bg-white md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="px-5 py-5">
        <p className="text-lg font-bold text-brand-graphite">인터넷공룡 관리자</p>
        <p className="mt-1 text-sm text-brand-slate">MVP 운영 화면</p>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 md:block md:space-y-2 md:px-4">
        {adminNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-xl px-4 py-3 text-sm font-medium ${
              isActive(item.href)
                ? "bg-brand-orange text-white"
                : "bg-brand-surface text-brand-graphite"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-4 pb-4">
        <AdminLogoutButton />
      </div>
    </aside>
  );
}
