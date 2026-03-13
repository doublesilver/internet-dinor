import { afterEach, describe, expect, it, vi } from "vitest";
import { getGithubRepositorySnapshot, getGithubRepositorySnapshots } from "../github";

describe("github repository snapshots", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.GITHUB_TOKEN;
  });

  it("returns null without calling fetch when the repository URL is invalid", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    await expect(getGithubRepositorySnapshot("https://example.com/not-github")).resolves.toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("maps the GitHub API payload into the snapshot shape", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        description: "포트폴리오 테스트 저장소",
        homepage: "",
        language: "TypeScript",
        stargazers_count: 12,
        forks_count: 3,
        updated_at: "2026-03-13T00:00:00.000Z"
      })
    } as unknown as Response);

    const snapshot = await getGithubRepositorySnapshot("https://github.com/doublesilver/internet-dinor");

    expect(snapshot).toEqual({
      description: "포트폴리오 테스트 저장소",
      homepage: null,
      language: "TypeScript",
      stars: 12,
      forks: 3,
      updatedAt: "2026-03-13T00:00:00.000Z"
    });
    expect(fetchSpy).toHaveBeenCalledWith("https://api.github.com/repos/doublesilver/internet-dinor", {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "internet-dinor-portfolio"
      },
      next: { revalidate: 21600 }
    });
  });

  it("adds a bearer token header when GITHUB_TOKEN is configured", async () => {
    process.env.GITHUB_TOKEN = "github-token";

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false
    } as Response);

    await expect(getGithubRepositorySnapshot("https://github.com/doublesilver/flolink_macro")).resolves.toBeNull();

    expect(fetchSpy).toHaveBeenCalledWith("https://api.github.com/repos/doublesilver/flolink_macro", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: "Bearer github-token",
        "User-Agent": "internet-dinor-portfolio"
      },
      next: { revalidate: 21600 }
    });
  });

  it("returns a map for multiple repositories", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        description: null,
        homepage: "https://demo.example.com",
        language: "TypeScript",
        stargazers_count: 7,
        forks_count: 1,
        updated_at: "2026-03-12T00:00:00.000Z"
      })
    } as unknown as Response);

    const snapshots = await getGithubRepositorySnapshots([
      "https://github.com/doublesilver/internet-dinor",
      "https://github.com/doublesilver/flolink_macro"
    ]);

    expect(snapshots.get("https://github.com/doublesilver/internet-dinor")).toMatchObject({
      homepage: "https://demo.example.com",
      stars: 7
    });
    expect(snapshots.get("https://github.com/doublesilver/flolink_macro")).toMatchObject({
      homepage: "https://demo.example.com",
      forks: 1
    });
  });
});
