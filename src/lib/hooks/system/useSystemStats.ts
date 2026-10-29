import { useQuery } from "@tanstack/react-query";

import { POLL_SYSTEM_MS } from "@/const/monitor.constant";
import { useLivePollOptions } from "@/lib/hooks/useRealtimeStatus";
import { getSystemStats } from "@/services/system.service";

import { systemKeys } from "./queryKeys";

// Dipakai kartu resource dan header sidebar (satu request). Selama SSE
// /stream tersambung, data diisi dari stream dan polling mati.
export const useSystemStats = () => {
  const liveOptions = useLivePollOptions(POLL_SYSTEM_MS);
  return useQuery({
    queryKey: systemKeys.stats(),
    queryFn: getSystemStats,
    select: (response) => response.data,
    ...liveOptions,
  });
};
