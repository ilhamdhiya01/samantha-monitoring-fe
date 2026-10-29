import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";

import type { LogLine as LogLineData } from "@/lib/types/log.types";

import LogLine from "./LogLine";

// Toleransi (px) untuk dianggap "sedang di bawah".
const BOTTOM_SLACK = 24;
// 12px × line-height 1.6
const ROW_ESTIMATE = 19;

interface LogConsoleProps {
  lines: LogLineData[];
  query: string;
}

const LogConsole = React.memo(({ lines, query }: LogConsoleProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isFollowing, setIsFollowing] = useState(true);

  const getItemKey = useCallback((index: number) => lines[index].id, [lines]);

  const virtualizer = useVirtualizer({
    count: lines.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_ESTIMATE,
    getItemKey,
    overscan: 20,
  });

  const scrollToBottom = useCallback(() => {
    if (lines.length > 0) {
      virtualizer.scrollToIndex(lines.length - 1, { align: "end" });
    }
  }, [lines.length, virtualizer]);

  // Ikuti baris baru hanya kalau user sedang di paling bawah.
  useLayoutEffect(() => {
    if (isFollowing) scrollToBottom();
  }, [lines, isFollowing, scrollToBottom]);

  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const distance =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    setIsFollowing(distance <= BOTTOM_SLACK);
  }, []);

  const handleJumpToBottom = useCallback(() => {
    setIsFollowing(true);
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        role="log"
        aria-live="off"
        aria-label="Isi log"
        className="absolute inset-0 overflow-y-auto bg-console py-2 font-mono text-xs leading-[1.6]"
      >
        {lines.length === 0 ? (
          <p className="m-0 p-4 text-log-empty">
            -- tidak ada baris yang cocok --
          </p>
        ) : (
          <div
            className="relative w-full"
            style={{ height: virtualizer.getTotalSize() }}
          >
            {virtualizer.getVirtualItems().map((item) => (
              <div
                key={item.key}
                ref={virtualizer.measureElement}
                data-index={item.index}
                className="absolute top-0 left-0 w-full"
                style={{ transform: `translateY(${item.start}px)` }}
              >
                <LogLine line={lines[item.index]} query={query} />
              </div>
            ))}
          </div>
        )}
      </div>
      {!isFollowing && lines.length > 0 && (
        <button
          type="button"
          onClick={handleJumpToBottom}
          className="absolute right-4 bottom-3 h-7 rounded-[3px] border border-ctrl-border bg-ctrl px-2.5 text-xs text-fg shadow-md"
        >
          ↓ ke baris terbaru
        </button>
      )}
    </div>
  );
});

LogConsole.displayName = "LogConsole";

export default LogConsole;
