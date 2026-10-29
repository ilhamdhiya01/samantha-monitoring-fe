import { API_STREAM } from "@/endpoints";
import type { DashboardStreamHandlers } from "@/lib/types/realtime.types";

const parse = <T>(event: Event): T | null => {
  try {
    return JSON.parse((event as MessageEvent<string>).data) as T;
  } catch {
    return null;
  }
};

// Satu koneksi SSE untuk system, containers dan alert aktif. Mengembalikan
// fungsi close. Tidak dipakai di mode mock (data mock tetap dipoll).
export const openDashboardStream = (
  handlers: DashboardStreamHandlers,
): (() => void) => {
  const source = new EventSource(API_STREAM, { withCredentials: true });

  const handleStats = (event: Event) => {
    const data =
      parse<Parameters<DashboardStreamHandlers["onStats"]>[0]>(event);
    if (data) handlers.onStats(data);
  };
  const handleContainers = (event: Event) => {
    const data =
      parse<Parameters<DashboardStreamHandlers["onContainers"]>[0]>(event);
    if (data) handlers.onContainers(data);
  };
  const handleAlerts = (event: Event) => {
    const data =
      parse<Parameters<DashboardStreamHandlers["onAlerts"]>[0]>(event);
    if (data) handlers.onAlerts(data);
  };

  source.onopen = handlers.onOpen;
  source.onerror = () =>
    handlers.onError(source.readyState === EventSource.CLOSED);
  source.addEventListener("stats", handleStats);
  source.addEventListener("containers", handleContainers);
  source.addEventListener("alerts", handleAlerts);

  return () => {
    source.removeEventListener("stats", handleStats);
    source.removeEventListener("containers", handleContainers);
    source.removeEventListener("alerts", handleAlerts);
    source.close();
  };
};
