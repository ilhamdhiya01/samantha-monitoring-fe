import { describe, expect, it } from "vitest";

import {
  formatBytes,
  formatBytesPair,
  formatDuration,
  formatMemShort,
  formatRelative,
  shortImageId,
} from "../format.helper";

const GB = 1024 ** 3;
const MB = 1024 ** 2;

describe("format.helper", () => {
  it("formats bytes with an Indonesian decimal comma", () => {
    expect(formatBytes(18.4 * GB)).toBe("18,4 GB");
    expect(formatBytes(212 * MB)).toBe("212 MB");
    expect(formatBytesPair(2.9 * GB, 4 * GB)).toBe("2,9 / 4,0 GB");
    expect(formatBytesPair(66 * GB, 80 * GB, 0)).toBe("66 / 80 GB");
  });

  it("formats short memory for narrow columns", () => {
    expect(formatMemShort(310 * MB)).toBe("310M");
    expect(formatMemShort(1.2 * GB)).toBe("1,2G");
  });

  it("formats durations like the design", () => {
    expect(formatDuration(10)).toBe("10s");
    expect(formatDuration(5 * 60)).toBe("5m");
    expect(formatDuration(3 * 3600)).toBe("3h");
    expect(formatDuration((2 * 24 + 4) * 3600)).toBe("2d 4h");
    expect(formatDuration(23 * 24 * 3600 + 3600)).toBe("23d");
  });

  it("formats relative time", () => {
    const now = Date.parse("2026-10-29T10:44:00Z");
    expect(formatRelative(now - 2_000, now)).toBe("baru saja");
    expect(formatRelative(now - 12_000, now)).toBe("12 dtk lalu");
    expect(formatRelative("2026-10-29T10:42:00Z", now)).toBe("2 mnt lalu");
    expect(formatRelative("2026-10-29T09:30:00Z", now)).toBe("1 jam lalu");
  });

  it("shortens image ids", () => {
    expect(shortImageId("sha256:a3f9c1e07b2d99887766")).toBe("a3f9c1e07b2d");
  });
});
