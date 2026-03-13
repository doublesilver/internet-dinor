import type { GithubRepositorySnapshot } from "@/types/portfolio";

interface GithubRepositoryResponse {
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string | null;
}

const GITHUB_API_BASE_URL = "https://api.github.com/repos";
const GITHUB_REVALIDATE_SECONDS = 60 * 60 * 6;

function getGithubRepoSlug(repoUrl: string) {
  try {
    const url = new URL(repoUrl);

    if (url.hostname !== "github.com") {
      return null;
    }

    const slug = url.pathname.replace(/^\/+/, "").replace(/\.git$/, "");
    return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(slug) ? slug : null;
  } catch {
    return null;
  }
}

export async function getGithubRepositorySnapshot(
  repoUrl: string
): Promise<GithubRepositorySnapshot | null> {
  const repoSlug = getGithubRepoSlug(repoUrl);

  if (!repoSlug) {
    return null;
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "internet-dinor-portfolio"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE_URL}/${repoSlug}`, {
      headers,
      next: { revalidate: GITHUB_REVALIDATE_SECONDS }
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as GithubRepositoryResponse;

    return {
      description: data.description,
      homepage: data.homepage || null,
      language: data.language,
      stars: Number.isFinite(data.stargazers_count) ? data.stargazers_count : null,
      forks: Number.isFinite(data.forks_count) ? data.forks_count : null,
      updatedAt: data.updated_at
    };
  } catch {
    return null;
  }
}

export async function getGithubRepositorySnapshots(repoUrls: string[]) {
  const entries = await Promise.all(
    repoUrls.map(async (repoUrl) => [repoUrl, await getGithubRepositorySnapshot(repoUrl)] as const)
  );

  return new Map(entries);
}
