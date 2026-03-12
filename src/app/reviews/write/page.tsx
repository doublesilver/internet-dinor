import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { getSiteSettings } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "후기 작성",
  description: "인터넷공룡을 통해 가입한 후기를 작성해주세요."
};

export default async function ReviewWritePage() {
  const settings = await getSiteSettings();

  return (
    <SiteShell settings={settings}>
      <section className="section-space">
        <div className="container-page max-w-2xl">
          <SectionHeading
            eyebrow="Write"
            title="후기 작성"
            description="인터넷공룡을 통해 가입한 후기를 작성해주세요. 작성된 후기는 검토 후 게시됩니다."
          />

          <form className="space-y-6 rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <div>
              <label htmlFor="reviewer" className="mb-1 block text-sm font-semibold text-brand-graphite">
                작성자명
              </label>
              <input
                id="reviewer"
                type="text"
                placeholder="홍길동"
                className="field-input w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="carrier" className="mb-1 block text-sm font-semibold text-brand-graphite">
                가입 통신사
              </label>
              <select id="carrier" className="field-input w-full" required>
                <option value="">선택해주세요</option>
                <option value="sk">SK브로드밴드</option>
                <option value="kt">KT</option>
                <option value="lg">LG유플러스</option>
                <option value="skylife">KT스카이라이프</option>
                <option value="hellovision">LG헬로비전</option>
              </select>
            </div>

            <div>
              <label htmlFor="rating" className="mb-1 block text-sm font-semibold text-brand-graphite">
                만족도
              </label>
              <select id="rating" className="field-input w-full" required>
                <option value="">선택해주세요</option>
                <option value="5">★★★★★ 매우 만족</option>
                <option value="4">★★★★☆ 만족</option>
                <option value="3">★★★☆☆ 보통</option>
                <option value="2">★★☆☆☆ 불만족</option>
                <option value="1">★☆☆☆☆ 매우 불만족</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-semibold text-brand-graphite">
                제목
              </label>
              <input
                id="title"
                type="text"
                placeholder="후기 제목을 입력하세요"
                className="field-input w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="mb-1 block text-sm font-semibold text-brand-graphite">
                후기 내용
              </label>
              <textarea
                id="content"
                rows={6}
                placeholder="가입 경험, 상담 품질, 설치 과정 등 자유롭게 작성해주세요."
                className="field-input w-full resize-y"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-brand-orange py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                후기 등록
              </button>
              <Link
                href="/reviews"
                className="rounded-xl border border-brand-border px-6 py-3 text-sm font-semibold text-brand-slate transition-colors hover:bg-gray-50"
              >
                취소
              </Link>
            </div>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
