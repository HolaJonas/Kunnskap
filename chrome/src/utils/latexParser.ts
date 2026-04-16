function parseLatex(str: string) {
  const parts = str.split("$");
  const hasUnmatchedOpeningDollar = parts.length % 2 === 0;

  return parts
    .map((segment: string, index: number) => {
      const isMathSegment = index % 2 !== 0;

      if (!isMathSegment) {
        return segment ? `\\text{${segment}}` : "";
      }

      if (hasUnmatchedOpeningDollar && index === parts.length - 1) {
        return `\\text{$${segment}}`;
      }

      return segment;
    })
    .join("");
}

function inverseParseLatex(str: string) {
  const segments = [];
  let i = 0;

  while (i < str.length) {
    if (str.startsWith("\\text{", i)) {
      let j = i + 6;
      let depth = 1;

      while (j < str.length && depth > 0) {
        const char = str[j];
        const prevChar = j > i ? str[j - 1] : "";

        if (char === "{" && prevChar !== "\\") depth += 1;
        if (char === "}" && prevChar !== "\\") depth -= 1;
        j += 1;
      }

      const text = str.slice(i + 6, Math.max(i + 6, j - 1));
      segments.push({ type: "text", value: text });
      i = j;
      continue;
    }

    const nextTextIndex = str.indexOf("\\text{", i);
    const end = nextTextIndex === -1 ? str.length : nextTextIndex;
    const math = str.slice(i, end);

    if (math) {
      segments.push({ type: "math", value: math });
    }

    i = end;
  }

  return segments
    .map((segment) =>
      segment.type === "text" ? segment.value : `$${segment.value}$`,
    )
    .join("");
}

export { parseLatex, inverseParseLatex };
