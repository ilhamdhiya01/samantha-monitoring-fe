import { createContext, useContext } from "react";

import type { RealtimeStatus } from "@/lib/types/realtime.types";

// Disediakan RealtimeProvider (main.tsx). Tanpa provider (tes, mode mock)
// realtime dianggap tidak tersedia → polling jalan seperti biasa.
export const RealtimeStatusContext =
  createContext<RealtimeStatus>("unavailable");

export const useRealtimeStatus = (): RealtimeStatus =>
  useContext(RealtimeStatusContext);

// Opsi poll untuk query yang juga dikirim lewat SSE: selama stream
// tersambung tidak ada poll maupun refetch saat jendela kembali fokus;
// saat putus, keduanya hidup lagi otomatis.
export const useLivePollOptions = (pollMs: number) => {
  const isLive = useRealtimeStatus() === "open";
  return {
    refetchInterval: isLive ? (false as const) : pollMs,
    refetchOnWindowFocus: !isLive,
  };
};
