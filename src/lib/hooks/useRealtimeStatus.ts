import { createContext, useContext } from "react";

import type { RealtimeStatus } from "@/lib/types/realtime.types";

// Disediakan RealtimeProvider (main.tsx). Tanpa provider (tes, mode mock)
// realtime dianggap tidak tersedia → polling jalan seperti biasa.
export const RealtimeStatusContext =
  createContext<RealtimeStatus>("unavailable");

export const useRealtimeStatus = (): RealtimeStatus =>
  useContext(RealtimeStatusContext);

// Opsi poll untuk query yang juga dikirim lewat SSE. Selama stream
// tersambung, cache selalu dianggap segar (stream yang memperbaruinya):
// tidak ada poll, refetch saat fokus, maupun refetch saat komponen dipasang
// ulang karena pindah menu. Saat putus, data segar sampai jadwal poll
// berikutnya, lalu poll jalan lagi.
export const useLivePollOptions = (pollMs: number) => {
  const isLive = useRealtimeStatus() === "open";
  return {
    refetchInterval: isLive ? (false as const) : pollMs,
    refetchOnWindowFocus: !isLive,
    staleTime: isLive ? Infinity : pollMs,
  };
};
