import { USE_MOCK } from "@/const/monitor.constant";
import { API_LOG_STREAM } from "@/endpoints";
import type { LogLine } from "@/lib/types/log.types";

import { openMockLogStream } from "./mock/log-generator.mock";

export interface LogStreamHandlers {
  // Baris terakhir yang sudah diterima; backend melanjutkan setelahnya.
  lastId?: string;
  onOpen: () => void;
  onLines: (lines: LogLine[]) => void;
  // isClosed: EventSource menyerah (mis. 401/5xx) dan tidak reconnect sendiri.
  onError: (isClosed: boolean) => void;
}

const parseLine = (event: MessageEvent<string>): LogLine | null => {
  try {
    return JSON.parse(event.data) as LogLine;
  } catch {
    return null;
  }
};

// Buka stream SSE log satu container. Mengembalikan fungsi close.
export const openLogStream = (
  container: string,
  handlers: LogStreamHandlers,
): (() => void) => {
  if (USE_MOCK) return openMockLogStream(container, handlers);

  // Saat EventSource reconnect sendiri, browser mengirim Last-Event-ID.
  // Saat dibuka ulang manual, posisi terakhir dikirim lewat query.
  const url = handlers.lastId
    ? `${API_LOG_STREAM(container)}?lastEventId=${encodeURIComponent(handlers.lastId)}`
    : API_LOG_STREAM(container);
  const source = new EventSource(url, { withCredentials: true });

  const handleLog = (event: MessageEvent<string>) => {
    const line = parseLine(event);
    if (line) handlers.onLines([line]);
  };

  source.onopen = handlers.onOpen;
  source.onerror = () =>
    handlers.onError(source.readyState === EventSource.CLOSED);
  source.addEventListener("log", handleLog);

  return () => {
    source.removeEventListener("log", handleLog);
    source.close();
  };
};
