export interface PortfolioProjectTheme {
  accent: string;
  surface: string;
  glow: string;
  border: string;
}

export interface PortfolioStat {
  label: string;
  value: string;
}

export interface PortfolioProfile {
  eyebrow: string;
  title: string;
  description: string;
  availability: string;
  githubProfileUrl: string;
  ctaLabel: string;
  secondaryCtaLabel: string;
}

export interface PortfolioWorkflowStep {
  title: string;
  description: string;
}

export interface PortfolioProject {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  status: string;
  description: string;
  summary: string;
  repoUrl: string;
  demoUrl?: string;
  demoLabel?: string;
  demoHint: string;
  stack: string[];
  responsibilities: string[];
  highlights: string[];
  theme: PortfolioProjectTheme;
}

export interface GithubRepositorySnapshot {
  description: string | null;
  homepage: string | null;
  language: string | null;
  stars: number | null;
  forks: number | null;
  updatedAt: string | null;
}
