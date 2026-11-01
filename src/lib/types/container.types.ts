export type ContainerStatus =
  "running" | "restarting" | "exited" | "paused" | "created" | "dead";

export type ContainerHealth = "healthy" | "unhealthy" | "starting";

export interface ContainerInfo {
  id: string;
  name: string;
  image: string;
  tag: string;
  status: ContainerStatus;
  cpuPercent: number;
  memoryBytes: number;
  restartCount: number;
  // ISO; null kalau container belum pernah jalan.
  startedAt: string | null;
  // Exit code terakhir untuk container yang berhenti; null kalau jalan.
  // Exit 0 = selesai normal (mis. job migrate), bukan masalah.
  exitCode: number | null;
  // Label docker compose; null untuk container di luar compose (`docker run`).
  project: string | null;
  service: string | null;
  // Hasil healthcheck; null kalau container tidak punya healthcheck.
  health: ContainerHealth | null;
  // Mati karena kehabisan memori — pembeda exit 137 OOM vs `docker kill`.
  oomKilled: boolean;
  // ISO, terakhir kali berhenti; null kalau belum pernah berhenti.
  finishedAt: string | null;
  // "no" | "always" | "unless-stopped" | "on-failure".
  restartPolicy: string;
}
