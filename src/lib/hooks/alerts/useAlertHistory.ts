import { useQuery } from "@tanstack/react-query";

import { POLL_HISTORY_MS } from "@/const/monitor.constant";
import { getAlertHistory } from "@/services/alerts.service";

import { alertKeys } from "./queryKeys";

// Riwayat jarang berubah; RealtimeProvider juga meng-invalidate saat daftar
// alert aktif berubah, jadi alert yang baru muncul/pulih langsung terlihat.
export const useAlertHistory = (container: string) => {
  return useQuery({
    queryKey: alertKeys.history(container),
    queryFn: () => getAlertHistory(container),
    select: (response) => response.data,
    refetchInterval: POLL_HISTORY_MS,
    staleTime: POLL_HISTORY_MS,
  });
};
