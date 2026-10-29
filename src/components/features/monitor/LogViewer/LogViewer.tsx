import { useSearch } from "@tanstack/react-router";
import React, { useCallback, useMemo, useState } from "react";

import { filterLogLines } from "@/lib/helpers/log.helper";
import type { LogBufferSnapshot } from "@/lib/helpers/log-buffer.helper";
import { useLogStream } from "@/lib/hooks/logs/useLogStream";

import LogConsole from "./LogConsole";
import LogHeader from "./LogHeader";
import LogToolbar from "./LogToolbar";

interface LogViewerProps {
  container: string;
}

// Pasang dengan key={container} supaya jeda & buffer reset saat pindah.
const LogViewer = React.memo(({ container }: LogViewerProps) => {
  const { level = "ALL", q: query = "" } = useSearch({
    from: "/containers/$name",
  });
  const { snapshot, status } = useLogStream(container);

  // Saat dijeda tampilan dibekukan; buffer tetap terisi di belakang.
  const [pausedSnapshot, setPausedSnapshot] =
    useState<LogBufferSnapshot | null>(null);
  const visible = pausedSnapshot ?? snapshot;
  const pendingCount = pausedSnapshot
    ? snapshot.total - pausedSnapshot.total
    : 0;

  const filteredLines = useMemo(
    () => filterLogLines(visible.lines, level, query),
    [visible.lines, level, query],
  );

  const handleTogglePause = useCallback(
    () => setPausedSnapshot((current) => (current ? null : snapshot)),
    [snapshot],
  );

  return (
    <section
      aria-label="Log"
      className="flex h-[70vh] min-h-105 min-w-0 flex-1 flex-col lg:h-auto lg:min-h-115 lg:border-r lg:border-line"
    >
      <LogHeader
        container={container}
        streamStatus={status}
        isPaused={pausedSnapshot !== null}
        pendingCount={pendingCount}
        onTogglePause={handleTogglePause}
      />
      <LogToolbar
        level={level}
        query={query}
        matchCount={filteredLines.length}
      />
      <LogConsole lines={filteredLines} query={query} />
    </section>
  );
});

LogViewer.displayName = "LogViewer";

export default LogViewer;
