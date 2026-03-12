import Link from "next/link";
import { DinoCharacter } from "@/components/sections/DinoCharacter";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-brand-peach px-4 text-center">
      <DinoCharacter variant="404" className="mx-auto h-64 w-64" />
      <h1 className="text-6xl font-black font-surround text-brand-orange">404</h1>
      <h2 className="text-2xl font-black text-brand-graphite">페이지를 찾을 수 없어요</h2>
      <p className="max-w-md text-brand-slate">
        요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="rounded-2xl bg-brand-orange px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          홈으로 돌아가기
        </Link>
        <Link
          href="/apply"
          className="rounded-2xl bg-brand-sky px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          상담 신청하기
        </Link>
      </div>
    </div>
  );
}
