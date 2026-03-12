import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-6xl font-black text-brand-graphite">404</h1>
      <p className="max-w-md text-brand-slate">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="rounded-2xl bg-brand-orange px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
