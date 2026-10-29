import classNames from "classnames";
import React from "react";

import { formatLogTime } from "@/lib/helpers/format.helper";
import { splitHighlight } from "@/lib/helpers/log.helper";
import type { LogLevel, LogLine as LogLineData } from "@/lib/types/log.types";

const LEVEL_COLOR: Record<LogLevel, string> = {
  ERROR: "text-log-error",
  WARN: "text-log-warn",
  INFO: "text-log-info",
};

interface LogLineProps {
  line: LogLineData;
  query: string;
}

// Isi log dirender sebagai teks (bukan HTML) supaya tidak bisa menyuntik
// script ke dashboard; hasil pencarian ditandai dengan <mark>.
const LogLine = React.memo(({ line, query }: LogLineProps) => (
  <div
    className={classNames("flex gap-2.5 px-4", {
      "bg-log-error-bg": line.level === "ERROR",
    })}
  >
    <span className="shrink-0 text-log-time">{formatLogTime(line.ts)}</span>
    <span className={classNames("w-10 shrink-0", LEVEL_COLOR[line.level])}>
      {line.level}
    </span>
    <span className="min-w-0 wrap-anywhere whitespace-pre-wrap text-log-text">
      {splitHighlight(line.text, query).map((segment, index) =>
        segment.isMatch ? (
          <mark key={index} className="rounded-xs bg-log-mark text-log-text">
            {segment.text}
          </mark>
        ) : (
          <React.Fragment key={index}>{segment.text}</React.Fragment>
        ),
      )}
    </span>
  </div>
));

LogLine.displayName = "LogLine";

export default LogLine;
