import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { ReviewCard } from "@/components/sections/ReviewCard";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { getReviews, getSiteSettings } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "고객 후기",
  description: "인터넷공룡을 통해 상담받은 고객들의 실제 후기입니다."
};

export default async function ReviewsPage() {
  const [settings, reviews] = await Promise.all([getSiteSettings(), getReviews()]);

  return (
    <SiteShell settings={settings}>
      <section className="section-space">
        <div className="container-page">
          <SectionHeading
            eyebrow="Review"
            title="상담 후 결정한 고객 후기"
            description="후기 페이지는 텍스트 중심으로 신뢰를 만들고, 비슷한 상황의 고객을 다시 문의로 회수하는 역할을 합니다."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
