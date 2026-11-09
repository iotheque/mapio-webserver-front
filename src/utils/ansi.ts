export interface AnsiSegment {
  text: string;
  color?: string;
}

const COLORS: Record<number, string> = {
  30: "#7f7f7f",
  31: "#ff5555",
  32: "#50fa7b",
  33: "#f1fa8c",
  34: "#6272ff",
  35: "#ff79c6",
  36: "#8be9fd",
  37: "#ffffff",
};

// Turn SGR color escape codes into plain segments, so that logs never need v-html
export function parseAnsi(input: string): AnsiSegment[] {
  const text = input.replace(/\u001b\[[\d;?]*[A-LN-Za-ln-z]/g, "");
  const segments: AnsiSegment[] = [];
  let color: string | undefined;
  let last = 0;

  const push = (end: number) => {
    if (end > last) segments.push({ text: text.slice(last, end), color });
  };

  for (const match of text.matchAll(/\u001b\[([\d;]*)m/g)) {
    push(match.index!);
    last = match.index! + match[0].length;
    for (const part of (match[1] || "0").split(";")) {
      const code = Number(part);
      if (code === 0 || code === 39) color = undefined;
      else if (COLORS[code]) color = COLORS[code];
      else if (COLORS[code - 60]) color = COLORS[code - 60];
    }
  }
  push(text.length);
  return segments;
}
