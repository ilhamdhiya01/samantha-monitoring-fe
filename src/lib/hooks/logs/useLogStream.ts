import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import {
  LOG_BUFFER_MAX,
  LOG_STREAM_BACKOFF_MS,
} from "@/const/monitor.constant";
import { createLogBuffer } from "@/lib/helpers/log-buffer.helper";
import type { LogStreamStatus } from "@/lib/types/log.types";
import { openLogStream } from "@/services/logs.service";

type Timer = ReturnType<typeof setTimeout> | undefined;

// Satu stream log aktif per tab. Ganti container = stream lama ditutup,
// buffer baru dibuat.
export const useLogStream = (container: string) => {
  const buffer = useMemo(
    () => createLogBuffer(LOG_BUFFER_MAX),
    // Buffer terikat ke satu container.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [container],
  );
  const [status, setStatus] = useState<LogStreamStatus>("connecting");

  useEffect(() => {
    let close: (() => void) | undefined;
    let retryTimer: Timer;
    let attempt = 0;

    const connect = () => {
      retryTimer = undefined;
      close = openLogStream(container, {
        lastId: buffer.lastId(),
        onOpen: () => {
          attempt = 0;
          setStatus("open");
        },
        onLines: buffer.push,
        onError: (isClosed) => {
          setStatus("error");
          if (!isClosed) return;
          // EventSource menyerah; buka ulang dengan backoff.
          close?.();
          const delay =
            LOG_STREAM_BACKOFF_MS[
              Math.min(attempt, LOG_STREAM_BACKOFF_MS.length - 1)
            ];
          attempt += 1;
          retryTimer = setTimeout(connect, delay);
        },
      });
    };

    connect();

    return () => {
      clearTimeout(retryTimer);
      close?.();
      setStatus("connecting");
    };
  }, [buffer, container]);

  const snapshot = useSyncExternalStore(buffer.subscribe, buffer.getSnapshot);

  return { snapshot, status };
};
