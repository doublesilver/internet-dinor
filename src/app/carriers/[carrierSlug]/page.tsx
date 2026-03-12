import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { ProductCard } from "@/components/sections/ProductCard";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getCarrierBySlug, getCarriers, getProductsByCarrierSlug, getSiteSettings } from "@/lib/repositories/content";

export async function generateStaticParams() {
  const carriers = await getCarriers();
  return carriers.map((carrier) => ({ carrierSlug: carrier.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ carrierSlug: string }> }): Promise<Metadata> {
  const { carrierSlug } = await params;
  const carrier = await getCarrierBySlug(carrierSlug);
  if (!carrier) return {};
  return {
    title: `${carrier.shortName} 인터넷/TV 상품`,
    description: carrier.heroDescription,
    openGraph: { title: `${carrier.shortName} 인터넷/TV 상품`, description: carrier.heroDescription }
  };
}

export default async function CarrierDetailPage({ params }: { params: Promise<{ carrierSlug: string }> }) {
  const { carrierSlug } = await params;
  const [settings, carrier, products] = await Promise.all([
    getSiteSettings(),
    getCarrierBySlug(carrierSlug),
    getProductsByCarrierSlug(carrierSlug)
  ]);

  if (!carrier) notFound();

  return (
    <SiteShell settings={settings}>
      <section className="section-space bg-brand-lavender-soft/40">
        <div className="container-page space-y-6">
          <p className="text-sm font-semibold text-brand-orange">홈 &gt; 통신사별 상품 &gt; {carrier.shortName}</p>
          <h1 className="text-4xl font-black tracking-tight text-brand-graphite md:text-5xl">{carrier.heroTitle}</h1>
          <p className="max-w-3xl text-base leading-7 text-brand-slate">{carrier.heroDescription}</p>
          <div className="flex flex-wrap gap-3">
            <Button href="/compare">대표 상품 보기</Button>
            <Button href="/apply" variant="secondary">
              빠른 문의
            </Button>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-page">
          <SectionHeading title="이 통신사에서 많이 찾는 포인트" description="통신사 허브 페이지는 홈과 상품 상세 사이를 연결하는 중간 정보 페이지 역할을 합니다." />
          <div className="grid gap-5 md:grid-cols-3">
            {carrier.featurePoints.map((point) => (
              <article key={point} className="surface-card">
                <h3 className="text-lg font-bold text-brand-graphite">{point}</h3>
                <p className="mt-3 text-sm leading-6 text-brand-slate">실제 운영 전에는 이 영역의 문구와 데이터만 교체하면 됩니다.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-brand-sky-soft">
        <div className="container-page">
          <SectionHeading title="대표 상품" description="통신사 상세는 개별 상품으로 넘어가기 전 상품군의 성격을 요약하는 용도로 사용합니다." />
          <div className="grid gap-5 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
