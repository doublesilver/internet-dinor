import type { GithubRepositorySnapshot, PortfolioProject } from "@/types/portfolio";

interface PortfolioProjectCardProps {
  project: PortfolioProject;
  snapshot: GithubRepositorySnapshot | null;
}

function formatUpdatedAt(updatedAt: string | null) {
  if (!updatedAt) {
    return "수동 관리";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(updatedAt));
}

function getRepositoryPath(repoUrl: string) {
  try {
    const url = new URL(repoUrl);
    return `${url.hostname}${url.pathname}`;
  } catch {
    return repoUrl;
  }
}

function getMetricValue(value: number | null, fallback: string) {
  return value === null ? fallback : value.toLocaleString("ko-KR");
}

export function PortfolioProjectCard({
  project,
  snapshot
}: PortfolioProjectCardProps) {
  const liveUrl = project.demoUrl ?? snapshot?.homepage ?? undefined;
  const summary = snapshot?.description?.trim() || project.summary;
  const metrics = [
    {
      label: "최근 업데이트",
      value: formatUpdatedAt(snapshot?.updatedAt ?? null)
    },
    {
      label: "대표 언어",
      value: snapshot?.language ?? project.stack[0]
    },
    {
      label: "Stars",
      value: getMetricValue(snapshot?.stars ?? null, "비공개/미표시")
    },
    {
      label: "Forks",
      value: getMetricValue(snapshot?.forks ?? null, "비공개/미표시")
    }
  ];

  return (
    <article
      id={project.slug}
      className="relative overflow-hidden rounded-[34px] border bg-white shadow-[0_28px_80px_rgba(15,23,42,0.08)]"
      style={{ borderColor: project.theme.border }}
    >
      <div
        className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full blur-3xl"
        style={{ background: project.theme.glow }}
      />

      <div className="relative p-7 text-white md:p-9" style={{ background: project.theme.surface }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              {project.category}
            </span>
            <span className="rounded-full border border-white/15 bg-slate-950/20 px-3 py-1 text-xs font-medium text-white">
              {project.status}
            </span>
          </div>
          <span className="text-sm font-semibold text-white/80">{project.year}</span>
        </div>

        <h2 className="mt-6 text-3xl font-black leading-tight md:text-4xl">{project.title}</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-white/80 md:text-lg">{project.subtitle}</p>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-white/85 md:text-base">{project.description}</p>
      </div>

      <div className="relative grid gap-8 p-7 md:p-9 xl:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Overview</p>
          <p className="mt-4 text-base leading-8 text-slate-700">{summary}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold text-white"
                style={{ backgroundColor: project.theme.accent }}
              >
                {project.demoLabel ?? "데모 보기"}
              </a>
            ) : (
              <span className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600">
                {project.demoLabel ?? "시연 문의"}
              </span>
            )}
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
            >
              GitHub 저장소
            </a>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-500">{project.demoHint}</p>
          <p className="mt-3 break-all text-xs text-slate-400">{getRepositoryPath(project.repoUrl)}</p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Role</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                {project.responsibilities.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Highlights</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                {project.highlights.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-[#faf8f5] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Repository snapshot</p>
          <div className="mt-5 grid gap-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white bg-white px-4 py-4 shadow-[0_12px_32px_rgba(15,23,42,0.04)]"
              >
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{metric.label}</p>
                <p className="mt-2 text-base font-semibold text-slate-800">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
