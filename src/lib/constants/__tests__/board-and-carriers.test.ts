import { describe, expect, it } from "vitest";
import { getBoardCategories, getBoardCategoryConfig } from "@/lib/constants/board";
import { getCarrierTheme } from "@/lib/constants/carriers";

describe("board category config", () => {
  it("returns configs for every public board category", () => {
    expect(getBoardCategories()).toEqual(["event", "guide", "notice"]);
    expect(getBoardCategoryConfig("guide")?.showRelatedProducts).toBe(true);
    expect(getBoardCategoryConfig("notice")?.featuredVariant).toBe("none");
  });

  it("returns null for unsupported categories", () => {
    expect(getBoardCategoryConfig("unknown")).toBeNull();
  });
});

describe("carrier theme config", () => {
  it("returns a carrier specific theme when the slug is known", () => {
    expect(getCarrierTheme("kt")).toEqual({
      accentColor: "#FF5B62",
      logoPath: "/images/carriers/kt_logo.png",
      logoAlt: "KT"
    });
  });

  it("falls back to the default theme when the slug is unknown", () => {
    expect(getCarrierTheme("unknown")).toEqual({
      accentColor: "#f15c2d",
      logoPath: "/images/carriers/sk_logo.png",
      logoAlt: "인터넷공룡"
    });
  });
});
