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

// Container yang berhenti dengan exit 0 (job migrate dll.) selesai normal.
export const isFinished = (status: ContainerStatus, exitCode: number | null) =>
  status === "exited" && exitCode === 0;

export const getStatusTone = (
  status: ContainerStatus,
  exitCode: number | null = null,
): Tone => {
  if (status === "running") return "ok";
  if (isFinished(status, exitCode)) return "muted";
  if (status === "restarting" || status === "paused") return "warn";
  if (status === "created") return "muted";
  return "err";
};

// "running", "selesai", "exited (1)".
export const getStatusLabel = (
  status: ContainerStatus,
  exitCode: number | null = null,
) => {
  if (isFinished(status, exitCode)) return "selesai";
  if (status === "exited" && exitCode !== null) return `exited (${exitCode})`;
  return status;
};

export const getRestartTone = (count: number): Tone =>
  count > RESTART_FLAG_COUNT ? "err" : "warn";
