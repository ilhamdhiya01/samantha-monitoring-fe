import type { LogLevelFilter, LogLine } from "@/lib/types/log.types";

export const filterLogLines = (
  lines: LogLine[],
  level: LogLevelFilter,
  query: string,
) => {
  const needle = query.trim().toLowerCase();
  if (level === "ALL" && !needle) return lines;
  return lines.filter(
    (line) =>
      (level === "ALL" || line.level === level) &&
      (!needle || line.text.toLowerCase().includes(needle)),
  );
};

export interface TextSegment {
  text: string;
  isMatch: boolean;
}

// Pecah teks jadi potongan biasa/cocok untuk dirender sebagai <mark>.
// Isi log tetap teks — tidak pernah dimasukkan sebagai HTML.
export const splitHighlight = (text: string, query: string): TextSegment[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return [{ text, isMatch: false }];

  const haystack = text.toLowerCase();
  const segments: TextSegment[] = [];
  let cursor = 0;
  let index = haystack.indexOf(needle);

  while (index !== -1) {
    if (index > cursor) {
      segments.push({ text: text.slice(cursor, index), isMatch: false });
    }
    segments.push({
      text: text.slice(index, index + needle.length),
      isMatch: true,
    });
    cursor = index + needle.length;
    index = haystack.indexOf(needle, cursor);
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), isMatch: false });
  }
  return segments;
};
