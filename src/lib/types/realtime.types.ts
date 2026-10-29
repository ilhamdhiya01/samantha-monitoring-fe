import type { Alert } from "./alert.types";
import type { ContainerInfo } from "./container.types";
import type { SystemStats } from "./system.types";

// open = SSE /stream tersambung, polling dimatikan.
export type RealtimeStatus = "connecting" | "open" | "unavailable";

export interface DashboardStreamHandlers {
  onOpen: () => void;
  onStats: (stats: SystemStats) => void;
  onContainers: (containers: ContainerInfo[]) => void;
  onAlerts: (alerts: Alert[]) => void;
  // isClosed: EventSource menyerah dan tidak reconnect sendiri.
  onError: (isClosed: boolean) => void;
}
