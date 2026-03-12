import { QuickInquiryForm } from "@/components/forms/QuickInquiryForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { ProductCard } from "@/components/sections/ProductCard";
import { ReviewCard } from "@/components/sections/ReviewCard";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getCarriers, getFeaturedPosts, getFeaturedProducts, getFeaturedReviews, getSiteSettings } from "@/lib/repositories/content";

export default async function HomePage() {
  const [settings, carriers, products, reviews, events, guides] = await Promise.all([
    getSiteSettings(),
    getCarriers(),
    getFeaturedProducts(),
    getFeaturedReviews(),
    getFeaturedPosts("event"),
    getFeaturedPosts("guide")
  ]);

  return (
    <SiteShell settings={settings}>
      <section className="overflow-hidden bg-gradient-to-b from-brand-sky-soft via-white to-white">
        <div className="container-page grid gap-8 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-brand-lavender-soft px-4 py-2 text-sm font-semibold text-brand-graphite">
              복잡한 인터넷 가입, 쉽게 비교해드립니다
            </span>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-brand-graphite md:text-6xl">
              우리 집에 맞는 인터넷/TV 조합
              <br />
              한 번에 비교하고 상담받으세요
            </h1>
            <p className="max-w-2xl text-base leading-7 text-brand-slate md:text-lg">
              이름과 연락처만 남기면 인터넷공룡이 신규, 변경, 재약정 기준으로 비교 포인트를 빠르게 정리해드립니다.
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-brand-graphite">
              <span className="rounded-full bg-white px-4 py-2 shadow-soft">빠른 상담 연결</span>
              <span className="rounded-full bg-white px-4 py-2 shadow-soft">맞춤 비교 안내</span>
              <span className="rounded-full bg-white px-4 py-2 shadow-soft">인터넷+TV 결합 상담</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/compare">대표 상품 비교</Button>
              <Button href={settings.phoneLink} variant="secondary">
                전화 상담
              </Button>
            </div>
          </div>
          <QuickInquiryForm sourcePage="/" submitLabel={settings.heroCtaLabel} />
        </div>
      </section>

      <section className="section-space">
        <div className="container-page">
          <SectionHeading
            eyebrow="Carrier Entry"
            title="어떤 통신사를 찾고 계신가요?"
            description="통신사별 대표 특징과 추천 구성을 먼저 보고, 맞는 상품으로 바로 넘어갈 수 있게 구성했습니다."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {carriers.map((carrier) => (
              <article key={carrier.id} className="surface-card">
                <h3 className="text-xl font-bold text-brand-graphite">{carrier.name}</h3>
                <p className="mt-3 text-sm leading-6 text-brand-slate">{carrier.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {carrier.featurePoints.map((point) => (
                    <span key={point} className="rounded-full bg-brand-sky-soft px-3 py-1 text-xs font-semibold text-brand-graphite">
                      {point}
                    </span>
                  ))}
                </div>
                <div className="mt-6">
                  <Button href={`/carriers/${carrier.slug}`} fullWidth>
                    {carrier.shortName} 상품 보기
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-brand-lavender-soft/50">
        <div className="container-page">
          <SectionHeading
            eyebrow="Scenario"
            title="상황에 맞게 보면 더 쉽습니다"
            description="사용자가 상품명보다 자신의 상황으로 진입할 수 있게 시나리오형 섹션을 두었습니다."
          />
          <div className="grid gap-5 md:grid-cols-4">
            {["이사 예정", "약정 만료", "1인 가구", "가족 결합"].map((item) => (
              <article key={item} className="surface-card bg-white">
                <h3 className="text-lg font-bold text-brand-graphite">{item}</h3>
                <p className="mt-3 text-sm leading-6 text-brand-slate">상황에 맞는 상품 조합과 상담 포인트를 먼저 확인할 수 있는 진입 카드입니다.</p>
                <div className="mt-6">
                  <Button href="/compare" variant="ghost" fullWidth>
                    이 조합 보기
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-page">
          <SectionHeading
            eyebrow="Featured Products"
            title="대표 상품으로 먼저 비교해보세요"
            description="가상 데이터 기반이지만 실제 운영 전 상품/혜택/문구만 교체하면 바로 활용할 수 있는 구조입니다."
            action={<Button href="/compare" variant="secondary">전체 비교 보기</Button>}
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-brand-sky-soft">
        <div className="container-page">
          <SectionHeading eyebrow="Trust" title="상담 전에 보면 좋은 후기와 가이드" description="후기와 정보성 콘텐츠를 함께 보여주고, 각 영역에서도 다시 문의로 이어질 수 있게 설계했습니다." />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-brand-graphite">후기 미리보기</h3>
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-brand-graphite">추천 콘텐츠</h3>
              {[...events, ...guides].map((post) => (
                <article key={post.id} className="surface-card">
                  <p className="text-sm font-semibold text-brand-orange">{post.type.toUpperCase()}</p>
                  <h4 className="mt-2 text-xl font-bold text-brand-graphite">{post.title}</h4>
                  <p className="mt-3 text-sm leading-6 text-brand-slate">{post.summary}</p>
                  <div className="mt-6">
                    <Button href={`/board/${post.type}/${post.slug}`} variant="ghost">
                      자세히 보기
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-page grid gap-8 rounded-[32px] bg-brand-graphite px-6 py-10 text-white md:grid-cols-[1fr_420px] md:px-10">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-sky">Final CTA</p>
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">비교가 어렵다면 연락처만 남겨주세요</h2>
            <p className="max-w-2xl text-sm leading-7 text-white/80 md:text-base">
              인터넷공룡이 조건별 차이와 상담 포인트를 먼저 정리해드리고, 실제 가입은 후속 상담으로 이어집니다.
            </p>
          </div>
          <QuickInquiryForm sourcePage="/#footer" submitLabel="빠른 상담 요청" />
        </div>
      </section>
    </SiteShell>
  );
}
