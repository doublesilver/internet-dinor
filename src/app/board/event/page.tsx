import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { EventBoardClient } from "@/components/sections/EventBoardClient";
import { getFeaturedPosts, getPostsByType, getSiteSettings } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "이벤트",
  description: "인터넷공룡의 최신 이벤트와 프로모션 소식을 확인하세요."
};

export default async function EventListPage() {
  const [settings, featured, allEvents, notices] = await Promise.all([
    getSiteSettings(),
    getFeaturedPosts("event"),
    getPostsByType("event"),
    getPostsByType("notice")
  ]);

  const featuredIds = new Set(featured.map((p) => p.id));
  const regular = allEvents.filter((p) => !featuredIds.has(p.id));

  return (
    <SiteShell settings={settings}>
      <section className="section-space">
        <div className="container-page">
          <SectionHeading
            eyebrow="Event"
            title="이벤트 &amp; 프로모션"
            description="인터넷공룡의 최신 이벤트와 프로모션 소식을 확인하세요."
          />
          <EventBoardClient
            featuredEvents={featured}
            regularEvents={regular}
            notices={notices}
          />
        </div>
      </section>
    </SiteShell>
  );
}
