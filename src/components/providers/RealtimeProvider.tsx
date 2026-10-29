import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import { REALTIME_BACKOFF_MS, USE_MOCK } from "@/const/monitor.constant";
import { alertKeys } from "@/lib/hooks/alerts/queryKeys";
import { containerKeys } from "@/lib/hooks/containers/queryKeys";
import { systemKeys } from "@/lib/hooks/system/queryKeys";
import { RealtimeStatusContext } from "@/lib/hooks/useRealtimeStatus";
import type { ApiResponse } from "@/lib/types/api.types";
import type { RealtimeStatus } from "@/lib/types/realtime.types";
import { openDashboardStream } from "@/services/stream.service";

type Timer = ReturnType<typeof setTimeout> | undefined;

interface RealtimeProviderProps {
  children: React.ReactNode;
}

// Satu SSE /stream per tab. Setiap event berisi data lengkap dan langsung
// ditulis ke cache Query dengan key yang sama dengan hook polling-nya, jadi
// komponen tidak tahu datanya datang dari poll atau stream. Saat tersambung
// BE mengirim kondisi terkini duluan — tidak perlu refetch setelah
// reconnect.
const RealtimeProvider = ({ children }: RealtimeProviderProps) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<RealtimeStatus>(
    USE_MOCK ? "unavailable" : "connecting",
  );

  useEffect(() => {
    if (USE_MOCK || typeof EventSource === "undefined") return;

    let close: (() => void) | undefined;
    let retryTimer: Timer;
    let attempt = 0;

    // Bentuk sama dengan respons REST ({ data }), karena `select` hook
    // membaca response.data.
    const write = <T,>(queryKey: readonly unknown[], data: T) =>
      queryClient.setQueryData<ApiResponse<T>>(queryKey, { data });

    const connect = () => {
      retryTimer = undefined;
      close = openDashboardStream({
        onOpen: () => {
          attempt = 0;
          setStatus("open");
        },
        onStats: (stats) => write(systemKeys.stats(), stats),
        onContainers: (containers) => write(containerKeys.list(), containers),
        onAlerts: (alerts) => write(alertKeys.active(), alerts),
        onError: (isClosed) => {
          // Polling jalan lagi selama stream putus.
          setStatus("unavailable");
          if (!isClosed) return;
          close?.();
          const delay =
            REALTIME_BACKOFF_MS[
              Math.min(attempt, REALTIME_BACKOFF_MS.length - 1)
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
    };
  }, [queryClient]);

  return (
    <RealtimeStatusContext.Provider value={status}>
      {children}
    </RealtimeStatusContext.Provider>
  );
};

export default RealtimeProvider;
