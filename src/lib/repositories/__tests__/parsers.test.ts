import { describe, expect, it } from "vitest";
import { parseCommaSeparatedText, parseLineSeparatedText, parsePairLines } from "../parsers";

describe("parseCommaSeparatedText", () => {
  it("splits by comma and trims", () => {
    expect(parseCommaSeparatedText("a, b , c")).toEqual(["a", "b", "c"]);
  });

  it("filters empty entries", () => {
    expect(parseCommaSeparatedText(",a,,b,")).toEqual(["a", "b"]);
  });

  it("handles empty string", () => {
    expect(parseCommaSeparatedText("")).toEqual([]);
  });

  it("returns single item without commas", () => {
    expect(parseCommaSeparatedText("hello")).toEqual(["hello"]);
  });
});

describe("parseLineSeparatedText", () => {
  it("splits by newline and trims", () => {
    expect(parseLineSeparatedText("line1\n  line2\nline3  ")).toEqual(["line1", "line2", "line3"]);
  });

  it("filters empty lines", () => {
    expect(parseLineSeparatedText("a\n\nb\n\n")).toEqual(["a", "b"]);
  });

  it("handles empty string", () => {
    expect(parseLineSeparatedText("")).toEqual([]);
  });
});

describe("parsePairLines", () => {
  it("parses key::value pairs", () => {
    const input = "title::body\nq::answer";
    expect(parsePairLines(input, "::")).toEqual([
      { left: "title", right: "body" },
      { left: "q", right: "answer" }
    ]);
  });

  it("handles delimiter in value", () => {
    const input = "key::val::ue";
    expect(parsePairLines(input, "::")).toEqual([{ left: "key", right: "val::ue" }]);
  });

  it("filters lines without both sides", () => {
    const input = "valid::pair\ninvalid\n::also-invalid";
    expect(parsePairLines(input, "::")).toEqual([{ left: "valid", right: "pair" }]);
  });

  it("handles empty string", () => {
    expect(parsePairLines("", "::")).toEqual([]);
  });
});
