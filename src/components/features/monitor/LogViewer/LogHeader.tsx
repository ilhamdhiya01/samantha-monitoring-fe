import classNames from "classnames";
import React from "react";

import Button from "@/components/ui/button";
import StatusDot from "@/components/ui/status-dot";
import { getStatusTone } from "@/lib/helpers/threshold.helper";
import { useContainer } from "@/lib/hooks/containers/useContainers";
import type { LogStreamStatus } from "@/lib/types/log.types";

const STATUS_TEXT = {
  ok: "text-ok",
  warn: "text-warn-fg",
  err: "text-err",
  muted: "text-muted",
};

const STREAM_LABEL: Record<LogStreamStatus, string> = {
  connecting: "menghubungkan…",
  open: "live · SSE",
  error: "terputus · mencoba lagi",
};

interface LogHeaderProps {
  container: string;
  streamStatus: LogStreamStatus;
  isPaused: boolean;
  pendingCount: number;
  onTogglePause: () => void;
}

const LogHeader = React.memo(
  ({
    container,
    streamStatus,
    isPaused,
    pendingCount,
    onTogglePause,
  }: LogHeaderProps) => {
    const { data: info } = useContainer(container);
    const tone = info ? getStatusTone(info.status) : "muted";

    return (
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-panel px-4 py-2">
        <h1 className="m-0 font-mono text-[13px] font-medium">{container}</h1>
        {info && (
          <>
            <span className="font-mono text-[11px] text-muted">
              {info.image}:{info.tag}
            </span>
            <span
              className={classNames(
                "inline-flex items-center gap-1.25 text-[11px]",
                STATUS_TEXT[tone],
              )}
            >
              <StatusDot tone={tone} size="sm" />
              {info.status}
            </span>
          </>
        )}
        <span className="flex-1" />
        <span
          aria-live="polite"
          className={classNames("text-[11px]", {
            "text-muted": isPaused || streamStatus !== "error",
            "text-err": !isPaused && streamStatus === "error",
          })}
        >
          {isPaused
            ? `stream dijeda${pendingCount > 0 ? ` · ${pendingCount} baris baru` : ""}`
            : STREAM_LABEL[streamStatus]}
        </span>
        <Button onClick={onTogglePause} aria-pressed={isPaused}>
          {isPaused ? "Lanjut" : "Jeda"}
        </Button>
      </div>
    );
  },
);

LogHeader.displayName = "LogHeader";

export default LogHeader;
