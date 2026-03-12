export function parseCommaSeparatedText(input: string) {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseLineSeparatedText(input: string) {
  return input
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parsePairLines(input: string, delimiter: string) {
  return parseLineSeparatedText(input)
    .map((line) => {
      const [left, ...rest] = line.split(delimiter);
      return {
        left: left?.trim() ?? "",
        right: rest.join(delimiter).trim()
      };
    })
    .filter((item) => item.left && item.right);
}
