export type ContainerStatus =
  "running" | "restarting" | "exited" | "paused" | "created" | "dead";

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
}
