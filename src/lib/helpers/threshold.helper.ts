import {
  RESTART_FLAG_COUNT,
  USAGE_CRITICAL_PCT,
  USAGE_WARN_PCT,
} from "@/const/monitor.constant";
import type { ContainerStatus } from "@/lib/types/container.types";

export type Tone = "ok" | "warn" | "err" | "muted";

export const toPercent = (used: number, total: number) =>
  total > 0 ? Math.min(100, (used / total) * 100) : 0;

// Hijau < 70%, kuning 70–85%, merah > 85%.
export const getUsageTone = (percent: number): Tone => {
  if (percent > USAGE_CRITICAL_PCT) return "err";
  if (percent >= USAGE_WARN_PCT) return "warn";
  return "ok";
};

export const getStatusTone = (status: ContainerStatus): Tone => {
  if (status === "running") return "ok";
  if (status === "restarting" || status === "paused") return "warn";
  if (status === "created") return "muted";
  return "err";
};

export const getRestartTone = (count: number): Tone =>
  count > RESTART_FLAG_COUNT ? "err" : "warn";
