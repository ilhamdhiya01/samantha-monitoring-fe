import { useQuery } from "@tanstack/react-query";

import { POLL_ALERTS_MS } from "@/const/monitor.constant";
import { useLivePollOptions } from "@/lib/hooks/useRealtimeStatus";
import { getActiveAlerts } from "@/services/alerts.service";

import { alertKeys } from "./queryKeys";

// Selama SSE /stream tersambung, alert baru datang lewat event `alerts`.
export const useActiveAlerts = () => {
  const liveOptions = useLivePollOptions(POLL_ALERTS_MS);
  return useQuery({
    queryKey: alertKeys.active(),
    queryFn: getActiveAlerts,
    select: (response) => response.data,
    ...liveOptions,
  });
};
