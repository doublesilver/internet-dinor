import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "후기 등록 완료",
  robots: { index: false, follow: false },
};

export default function ReviewCompleteePage() {
  return (
    <section className="section-space">
      <div className="container-page max-w-3xl">
        <div className="surface-card text-center">
          <p className="text-sm font-semibold text-brand-orange">Complete</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-brand-graphite">
            후기가 등록되었습니다
          </h1>
          <p className="mt-4 text-base leading-7 text-brand-slate">
            소중한 후기 감사합니다. 관리자 확인 후 게시됩니다.
          </p>
          <div className="mt-8 flex flex-col gap-3 md:flex-row md:justify-center">
            <Button href="/reviews">후기 목록 보기</Button>
            <Button href="/" variant="secondary">
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
