import { describe, expect, it } from "vitest";

import type { LogLine } from "@/lib/types/log.types";

import { filterLogLines, splitHighlight } from "../log.helper";

const line = (id: string, level: LogLine["level"], text: string): LogLine => ({
  id,
  ts: "2026-10-29T10:42:00.000Z",
  level,
  text,
});

const LINES = [
  line("1", "INFO", '"GET /api/products HTTP/1.1" 200 38ms'),
  line("2", "ERROR", "psycopg2.OperationalError: timeout expired"),
  line("3", "WARN", "ratelimit 429 on /api/auth/login"),
  line("4", "ERROR", '"POST /api/checkout HTTP/1.1" 500 61ms'),
];

describe("filterLogLines", () => {
  it("returns the same array when nothing is filtered", () => {
    expect(filterLogLines(LINES, "ALL", " ")).toBe(LINES);
  });

  it("filters by level", () => {
    expect(filterLogLines(LINES, "ERROR", "").map((l) => l.id)).toEqual([
      "2",
      "4",
    ]);
  });

  it("searches case-insensitively and combines with level", () => {
    expect(filterLogLines(LINES, "ALL", "API").map((l) => l.id)).toEqual([
      "1",
      "3",
      "4",
    ]);
    expect(filterLogLines(LINES, "ERROR", "checkout").map((l) => l.id)).toEqual(
      ["4"],
    );
  });
});

describe("splitHighlight", () => {
  it("returns the whole text when there is no query", () => {
    expect(splitHighlight("abc", "")).toEqual([
      { text: "abc", isMatch: false },
    ]);
  });

  it("marks every match and keeps the original casing", () => {
    expect(splitHighlight("Timeout then TIMEOUT.", "timeout")).toEqual([
      { text: "Timeout", isMatch: true },
      { text: " then ", isMatch: false },
      { text: "TIMEOUT", isMatch: true },
      { text: ".", isMatch: false },
    ]);
  });
});
