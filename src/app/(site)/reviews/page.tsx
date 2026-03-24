import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { ReviewCard } from "@/components/sections/ReviewCard";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { getFeaturedReviews, getReviews } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "고객 후기",
  description: "인터넷공룡을 통해 가입한 고객들의 실제 후기입니다.",
};

export default async function ReviewsPage() {
  const [featured, all] = await Promise.all([
    getFeaturedReviews(),
    getReviews(),
  ]);

  const featuredIds = new Set(featured.map((r) => r.id));
  const regular = all.filter((r) => !featuredIds.has(r.id));

  return (
    <section className="section-space">
      <div className="container-page">
        <SectionHeading
          eyebrow="Review"
          title="고객 후기"
          description="인터넷공룡을 통해 가입한 고객들의 실제 후기입니다."
        />

        <div className="mb-6 flex justify-end">
          <Button href="/reviews/write">후기 작성하기</Button>
        </div>

        {featured.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-orange">
              추천 후기
            </p>
            <div className="grid gap-4 lg:grid-cols-2">
              {featured.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl ring-2 ring-brand-orange ring-offset-2"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>
        )}

        {regular.length > 0 && (
          <div>
            {featured.length > 0 && (
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-slate">
                전체 후기
              </p>
            )}
            <div className="grid gap-5 lg:grid-cols-2">
              {regular.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}

        {featured.length === 0 && regular.length === 0 && (
          <p className="py-16 text-center text-brand-slate">
            등록된 후기가 없습니다.
          </p>
        )}
      </div>
    </section>
  );
}
