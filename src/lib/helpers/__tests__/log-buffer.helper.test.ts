import { describe, expect, it, vi } from "vitest";

import type { LogLine } from "@/lib/types/log.types";

import { createLogBuffer } from "../log-buffer.helper";

const lines = (from: number, count: number): LogLine[] =>
  Array.from({ length: count }, (_, index) => ({
    id: String(from + index),
    ts: "2026-10-29T10:42:00.000Z",
    level: "INFO",
    text: `line ${from + index}`,
  }));

const manualSchedule = () => {
  const queue: (() => void)[] = [];
  return {
    schedule: (callback: () => void) => queue.push(callback),
    run: () => queue.splice(0).forEach((callback) => callback()),
  };
};

describe("createLogBuffer", () => {
  it("batches pushes into one notification per frame", () => {
    const frame = manualSchedule();
    const buffer = createLogBuffer(10, frame.schedule);
    const listener = vi.fn();
    buffer.subscribe(listener);

    buffer.push(lines(1, 2));
    buffer.push(lines(3, 2));
    expect(listener).not.toHaveBeenCalled();
    expect(buffer.getSnapshot().lines).toHaveLength(0);

    frame.run();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(buffer.getSnapshot().lines.map((l) => l.id)).toEqual([
      "1",
      "2",
      "3",
      "4",
    ]);
  });

  it("keeps only the newest lines but counts every line", () => {
    const frame = manualSchedule();
    const buffer = createLogBuffer(3, frame.schedule);

    buffer.push(lines(1, 5));
    frame.run();

    const snapshot = buffer.getSnapshot();
    expect(snapshot.lines.map((l) => l.id)).toEqual(["3", "4", "5"]);
    expect(snapshot.total).toBe(5);
    expect(buffer.lastId()).toBe("5");
  });

  it("keeps a stable snapshot until the next flush", () => {
    const frame = manualSchedule();
    const buffer = createLogBuffer(10, frame.schedule);
    buffer.push(lines(1, 1));
    frame.run();
    const first = buffer.getSnapshot();

    expect(buffer.getSnapshot()).toBe(first);
    buffer.push(lines(2, 1));
    expect(buffer.getSnapshot()).toBe(first);
    frame.run();
    expect(buffer.getSnapshot()).not.toBe(first);
  });

  it("stops notifying after unsubscribe", () => {
    const frame = manualSchedule();
    const buffer = createLogBuffer(10, frame.schedule);
    const listener = vi.fn();
    const unsubscribe = buffer.subscribe(listener);

    unsubscribe();
    buffer.push(lines(1, 1));
    frame.run();
    expect(listener).not.toHaveBeenCalled();
  });
});
