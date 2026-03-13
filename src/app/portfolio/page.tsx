import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioProjectCard } from "@/components/portfolio/PortfolioProjectCard";
import {
  portfolioProfile,
  portfolioProjects,
  portfolioStats,
  portfolioWorkflow
} from "@/data/portfolio/projects";
import { getGithubRepositorySnapshots } from "@/lib/utils/github";

export const metadata: Metadata = {
  title: "포트폴리오 허브",
  description: "데모와 GitHub 저장소를 함께 보여주는 작업 포트폴리오 허브",
  robots: { index: false, follow: false }
};

const viewerChecklist = [
  "카드 하나마다 결과물, 저장소, 역할 범위를 빠르게 파악할 수 있게 구성했습니다.",
  "공개 데모가 어려운 내부 도구는 저장소와 시연 중심으로 분리해 설명합니다.",
  "면접이나 제안 단계에서 바로 검토할 수 있도록 기술보다 문제 해결 맥락을 먼저 보여줍니다."
];

export default async function PortfolioPage() {
  const githubSnapshots = await getGithubRepositorySnapshots(
    portfolioProjects.map((project) => project.repoUrl)
  );

  return (
    <main className="min-h-screen bg-[#f3ede4] text-slate-950">
      <section className="relative overflow-hidden bg-[#171a22] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(241,92,45,0.24),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(13,148,136,0.24),_transparent_30%)]" />
        <div className="container-page relative py-16 md:py-24">
          <div className="grid gap-10 xl:grid-cols-[1.25fr_0.75fr]">
            <div>
              <p className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                {portfolioProfile.eyebrow}
              </p>
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.25] md:text-6xl">
                {portfolioProfile.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/72 md:text-lg">
                {portfolioProfile.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={portfolioProfile.githubProfileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900"
                >
                  {portfolioProfile.ctaLabel}
                </a>
                <a
                  href="#selected-work"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90"
                >
                  {portfolioProfile.secondaryCtaLabel}
                </a>
              </div>

              <p className="mt-5 text-sm leading-7 text-white/55">{portfolioProfile.availability}</p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                  Why this page exists
                </p>
                <p className="mt-4 text-lg font-semibold leading-8 text-white/88">
                  코드를 깊게 보지 않더라도, 이 사람이 어떤 문제를 어떤 수준으로 해결했는지 빠르게 읽히는
                  포트폴리오를 목표로 했습니다.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                {portfolioStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-white/10 bg-slate-950/25 p-5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                      {item.label}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/78">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="selected-work" className="container-page py-16 md:py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Selected projects</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-5xl">클릭해서 바로 확인할 수 있는 작업물</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            보여주기 좋은 화면만 모아두지 않고, 각 프로젝트마다 데모 접근성, 저장소, 맡은 역할, 운영 포인트를
            함께 정리했습니다.
          </p>
        </div>

        <div className="grid gap-8">
          {portfolioProjects.map((project) => (
            <PortfolioProjectCard
              key={project.slug}
              project={project}
              snapshot={githubSnapshots.get(project.repoUrl) ?? null}
            />
          ))}
        </div>
      </section>

      <section className="bg-[#fbf6ef] py-16">
        <div className="container-page grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-[30px] bg-[#1d2230] p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">How I work</p>
            <h2 className="mt-4 text-3xl font-black leading-tight">실행 가능한 화면과 운영 가능한 구조를 같이 봅니다.</h2>
            <p className="mt-5 text-sm leading-8 text-white/70">
              외주든 채용이든 결국 중요한 건 결과를 빨리 보여주고, 그 결과물이 실제 운영에서도 버틸 수 있는지입니다.
              그래서 저는 구현 속도와 운영 안정성을 동시에 설명할 수 있는 작업물을 선호합니다.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {portfolioWorkflow.map((step) => (
              <div
                key={step.title}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.05)]"
              >
                <p className="text-sm font-bold text-slate-900">{step.title}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Review guide</p>
          <h2 className="mt-4 text-3xl font-black text-slate-900 md:text-4xl">
            면접관과 클라이언트가 빠르게 판단할 수 있는 방식으로 정리했습니다.
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {viewerChecklist.map((item) => (
              <div key={item} className="rounded-[24px] bg-[#f7f4ef] p-5 text-sm leading-7 text-slate-700">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={portfolioProfile.githubProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white"
            >
              GitHub 프로필 열기
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
            >
              인터넷공룡 홈으로
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
