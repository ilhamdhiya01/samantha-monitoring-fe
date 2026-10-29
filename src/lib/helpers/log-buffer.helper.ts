import type { LogLine } from "@/lib/types/log.types";

type Schedule = (callback: () => void) => void;

export interface LogBufferSnapshot {
  lines: LogLine[];
  // Total baris yang pernah masuk (tidak berkurang saat buffer dipangkas).
  total: number;
}

export interface LogBuffer {
  push: (lines: LogLine[]) => void;
  clear: () => void;
  getSnapshot: () => LogBufferSnapshot;
  subscribe: (listener: () => void) => () => void;
  lastId: () => string | undefined;
}

const defaultSchedule: Schedule = (callback) => {
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(callback);
  } else {
    setTimeout(callback, 16);
  }
};

// Ring buffer baris log di luar React. Baris yang masuk dikumpulkan dan
// subscriber diberi tahu paling banyak sekali per frame, supaya stream yang
// ramai tidak memicu render per baris. Dibaca lewat useSyncExternalStore.
export const createLogBuffer = (
  max: number,
  schedule: Schedule = defaultSchedule,
): LogBuffer => {
  let lines: LogLine[] = [];
  let total = 0;
  let snapshot: LogBufferSnapshot = { lines, total };
  let isScheduled = false;
  const listeners = new Set<() => void>();

  const flush = () => {
    isScheduled = false;
    snapshot = { lines, total };
    listeners.forEach((listener) => listener());
  };

  const notify = () => {
    if (isScheduled) return;
    isScheduled = true;
    schedule(flush);
  };

  return {
    push: (incoming) => {
      if (incoming.length === 0) return;
      const next = lines.concat(incoming);
      lines = next.length > max ? next.slice(next.length - max) : next;
      total += incoming.length;
      notify();
    },
    clear: () => {
      lines = [];
      total = 0;
      notify();
    },
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    lastId: () => lines.at(-1)?.id,
  };
};
