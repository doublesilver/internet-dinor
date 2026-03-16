import { describe, expect, it } from "vitest";
import { getBoardCategories, getBoardCategoryConfig, getBoardCategoryHref, getBoardNavigationItems, getBoardPostHref } from "@/lib/constants/board";
import { DEFAULT_CARRIER_THEME, getCarrierAccentColor, getCarrierTheme } from "@/lib/constants/carriers";

describe("board category config", () => {
  it("returns configs for every public board category", () => {
    expect(getBoardCategories()).toEqual(["event", "guide", "notice"]);
    expect(getBoardCategoryConfig("guide")?.showRelatedProducts).toBe(true);
    expect(getBoardCategoryConfig("notice")?.featuredVariant).toBe("none");
    expect(getBoardCategoryConfig("event")?.navigationLabel).toBe("이벤트");
  });

  it("returns null for unsupported categories", () => {
    expect(getBoardCategoryConfig("unknown")).toBeNull();
  });

  it("builds board list/detail hrefs and public navigation from the same source", () => {
    expect(getBoardCategoryHref("guide")).toBe("/board/guide");
    expect(getBoardPostHref("guide", "sample-post")).toBe("/board/guide/sample-post");
    expect(getBoardCategoryHref("unknown")).toBeNull();
    expect(getBoardNavigationItems()).toEqual([
      { href: "/board/event", label: "이벤트" },
      { href: "/board/guide", label: "꿀TIP" }
    ]);
  });
});

describe("carrier theme config", () => {
  it("returns a carrier specific theme when the slug is known", () => {
    expect(getCarrierTheme("kt")).toEqual({
      accentColor: "#6EA8D4",
      logoPath: "/images/carriers/kt_logo.png",
      logoAlt: "KT"
    });
  });

  it("falls back to the default theme when the slug is unknown", () => {
    expect(getCarrierTheme("unknown")).toEqual(DEFAULT_CARRIER_THEME);
    expect(getCarrierAccentColor("unknown")).toBe(DEFAULT_CARRIER_THEME.accentColor);
  });

  it("exposes the accent color from the shared carrier theme map", () => {
    expect(getCarrierAccentColor("lg")).toBe("#94C4E8");
  });
});
