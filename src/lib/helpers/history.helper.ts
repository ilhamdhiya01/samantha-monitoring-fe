import type { AlertHistoryItem } from "@/lib/types/alert.types";
import type { DeployEvent } from "@/lib/types/deploy.types";

const HOUR_MS = 3_600_000;

export const startOfHour = (time: number) =>
  Math.floor(time / HOUR_MS) * HOUR_MS;

export type TimelineItem =
  | { kind: "deploy"; id: string; time: string; deploy: DeployEvent }
  | { kind: "alert"; id: string; time: string; alert: AlertHistoryItem };

// Deploy dan alert satu container dalam satu urutan waktu, terbaru dulu —
// supaya "error naik setelah deploy" terbaca tanpa membandingkan dua daftar.
export const buildContainerTimeline = (
  deploys: DeployEvent[],
  alerts: AlertHistoryItem[],
  limit = 10,
): TimelineItem[] =>
  [
    ...deploys.map((deploy): TimelineItem => ({
      kind: "deploy",
      id: `deploy:${deploy.id}`,
      time: deploy.occurredAt,
      deploy,
    })),
    ...alerts.map((alert): TimelineItem => ({
      kind: "alert",
      id: `alert:${alert.id}`,
      time: alert.firedAt,
      alert,
    })),
  ]
    .sort((a, b) => Date.parse(b.time) - Date.parse(a.time))
    .slice(0, limit);

// Penanda deploy di grafik error per jam: key = awal jam (ms).
export const groupDeploysByHour = (deploys: DeployEvent[]) => {
  const byHour = new Map<number, DeployEvent[]>();
  deploys.forEach((deploy) => {
    const hour = startOfHour(Date.parse(deploy.occurredAt));
    byHour.set(hour, [...(byHour.get(hour) ?? []), deploy]);
  });
  return byHour;
};
