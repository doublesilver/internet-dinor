import { describe, expect, it } from "vitest";
import { buildPublicRecentApplications } from "@/data/fixtures/recent-applications";

describe("buildPublicRecentApplications", () => {
  it("builds a stable public-safe application feed from a fixed date", () => {
    const rows = buildPublicRecentApplications(new Date("2026-03-12T00:00:00.000Z"));

    expect(rows).toHaveLength(30);
    expect(rows[0]).toEqual({
      date: "03.12",
      name: "김 * *",
      installStatus: "설치완료",
      giftStatus: "입금완료"
    });
    expect(rows.at(-1)).toEqual({
      date: "03.02",
      name: "임 * *",
      installStatus: "설치완료",
      giftStatus: "입금완료"
    });
  });
});
