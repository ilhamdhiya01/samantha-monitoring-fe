// Data tiruan selama backend belum ada. Angka awal mengikuti design;
// nilai CPU/RAM sedikit berfluktuasi tiap poll supaya UI terasa hidup.
import type { Alert } from "@/lib/types/alert.types";
import type { ApiResponse } from "@/lib/types/api.types";
import type { ContainerInfo } from "@/lib/types/container.types";
import type { ImageInfo, ImageSummary } from "@/lib/types/image.types";
import type { ErrorHour } from "@/lib/types/log.types";
import type { SystemStats } from "@/lib/types/system.types";

const GB = 1024 ** 3;
const MB = 1024 ** 2;
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const BOOT_AT = Date.now();

const jitter = (value: number, spread: number, min = 0, max = Infinity) =>
  Math.min(max, Math.max(min, value + (Math.random() * 2 - 1) * spread));

const respond = <T>(data: T, delayMs = 120): Promise<ApiResponse<T>> =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), delayMs));

const iso = (msAgo: number) => new Date(BOOT_AT - msAgo).toISOString();

interface MockContainer extends Omit<ContainerInfo, "startedAt"> {
  startedMsAgo: number | null;
}

const CONTAINERS: MockContainer[] = [
  {
    id: "4f1c2a9e0b11",
    name: "tees-api",
    image: "tees-api",
    tag: "1.8.2",
    status: "running",
    cpuPercent: 12,
    memoryBytes: 310 * MB,
    restartCount: 3,
    startedMsAgo: 2 * DAY + 4 * HOUR,
    exitCode: null,
  },
  {
    id: "8b7d55c3e902",
    name: "tees-worker",
    image: "tees-worker",
    tag: "1.8.2",
    status: "restarting",
    cpuPercent: 0,
    memoryBytes: 48 * MB,
    restartCount: 14,
    startedMsAgo: 10_000,
    exitCode: null,
  },
  {
    id: "c09e1f7a3d45",
    name: "nginx",
    image: "nginx",
    tag: "1.27-alpine",
    status: "running",
    cpuPercent: 1,
    memoryBytes: 22 * MB,
    restartCount: 0,
    startedMsAgo: 23 * DAY,
    exitCode: null,
  },
  {
    id: "2d6a8e4b7f90",
    name: "postgres",
    image: "postgres",
    tag: "16",
    status: "running",
    cpuPercent: 6,
    memoryBytes: 480 * MB,
    restartCount: 0,
    startedMsAgo: 23 * DAY,
    exitCode: null,
  },
  {
    id: "7e3b9c1d5a26",
    name: "redis",
    image: "redis",
    tag: "7-alpine",
    status: "running",
    cpuPercent: 2,
    memoryBytes: 118 * MB,
    restartCount: 0,
    startedMsAgo: 23 * DAY,
    exitCode: null,
  },
  {
    id: "91c4e7a2b3d8",
    name: "tees-api-migrate",
    image: "tees-api",
    tag: "1.8.2-migrator",
    status: "exited",
    cpuPercent: 0,
    memoryBytes: 0,
    restartCount: 0,
    startedMsAgo: null,
    exitCode: 0,
  },
];

export const getMockSystemStats = () =>
  respond<SystemStats>({
    hostname: "vps-01",
    ip: "[IP VPS]",
    os: "Ubuntu 24.04",
    dockerVersion: "27.3",
    uptimeSec: Math.round((23 * DAY + (Date.now() - BOOT_AT)) / 1000),
    cpu: {
      percent: jitter(34, 6, 1, 100),
      load1: Number(jitter(0.68, 0.12, 0).toFixed(2)),
      cores: 2,
    },
    memory: {
      usedBytes: jitter(2.9 * GB, 0.05 * GB),
      totalBytes: 4 * GB,
      swapUsedBytes: 210 * MB,
    },
    disk: {
      mount: "/",
      usedBytes: 66 * GB,
      totalBytes: 80 * GB,
      dockerBytes: 18.4 * GB,
    },
  });

export const getMockContainers = () =>
  respond<ContainerInfo[]>(
    CONTAINERS.map(({ startedMsAgo, ...container }) => ({
      ...container,
      cpuPercent:
        container.status === "running"
          ? jitter(container.cpuPercent, container.cpuPercent * 0.3 + 0.5, 0)
          : 0,
      memoryBytes: jitter(container.memoryBytes, container.memoryBytes * 0.02),
      startedAt:
        startedMsAgo === null
          ? null
          : new Date(Date.now() - startedMsAgo).toISOString(),
    })),
  );

export const getMockContainerStatus = (name: string) =>
  CONTAINERS.find((container) => container.name === name)?.status;

// Urutan per jam dari 23 jam lalu sampai jam sekarang (design).
const ERRORS = [
  1, 0, 2, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 2, 1, 3, 4, 2, 9, 18, 7, 5,
];
const WARNINGS = [
  4, 3, 5, 2, 3, 2, 1, 1, 0, 1, 1, 2, 2, 3, 4, 6, 5, 7, 8, 6, 10, 12, 9, 8,
];

export const getMockErrorsHourly = () => {
  const currentHour = new Date();
  currentHour.setMinutes(0, 0, 0);
  return respond<ErrorHour[]>(
    ERRORS.map((errors, index) => ({
      hour: new Date(
        currentHour.getTime() - (ERRORS.length - 1 - index) * HOUR,
      ).toISOString(),
      errors,
      warnings: WARNINGS[index],
    })),
  );
};

export const getMockActiveAlerts = () =>
  respond<Alert[]>([
    {
      id: "al-3",
      kind: "restart_loop",
      severity: "critical",
      title: "tees-worker restart loop",
      description:
        "14 restart dalam 30 menit. Exit code 1: redis:6379 connection refused.",
      container: "tees-worker",
      firedAt: iso(2 * MINUTE),
    },
    {
      id: "al-2",
      kind: "disk_usage",
      severity: "critical",
      title: "Disk / 82% terpakai",
      description: "3 image dangling (1,2 GB) bisa di-prune.",
      container: null,
      firedAt: iso(72 * MINUTE),
    },
    {
      id: "al-1",
      kind: "error_spike",
      severity: "warning",
      title: "Error spike tees-api",
      description:
        "18 error jam 09:00, 15 di antaranya POST /api/checkout 500.",
      container: "tees-api",
      firedAt: iso(97 * MINUTE),
    },
  ]);

const image = (
  repository: string,
  tag: string | null,
  id: string,
  sizeMb: number,
  deployedDaysAgo: number | null,
  state: ImageInfo["state"],
  usedBy: ImageInfo["usedBy"] = [],
): ImageInfo => ({
  id: `sha256:${id}`,
  repository,
  tag,
  sizeBytes: sizeMb * MB,
  createdAt: iso((deployedDaysAgo ?? 30) * DAY + HOUR),
  deployedAt: deployedDaysAgo === null ? null : iso(deployedDaysAgo * DAY),
  state,
  usedBy,
});

const IMAGES: ImageInfo[] = [
  image("tees-api", "1.8.2", "a3f9c1e07b2d", 212, 0.6, "active", [
    { name: "tees-api", status: "running", exitCode: null },
  ]),
  image("tees-api", "1.8.1", "7c2d44b1e9a0", 209, 3.7, "previous"),
  image("tees-api", "1.8.0", "19e0ab77c3f4", 208, 8.5, "previous"),
  image("tees-worker", "1.8.2", "e51b9d0c2a68", 198, 0.6, "active", [
    { name: "tees-worker", status: "restarting", exitCode: null },
  ]),
  image("tees-worker", "1.8.1", "b0d7e3f1a925", 196, 3.7, "previous"),
  image("nginx", "1.27-alpine", "9f2e7b1c4d60", 48, 23, "active", [
    { name: "nginx", status: "running", exitCode: null },
  ]),
  image("postgres", "16", "5b8c0d2e6f13", 432, 23, "active", [
    { name: "postgres", status: "running", exitCode: null },
  ]),
  image("redis", "7-alpine", "3c6f9a0e8b27", 41, 23, "active", [
    { name: "redis", status: "running", exitCode: null },
  ]),
  image("tees-api", "1.8.2-migrator", "c5e8a1f4d207", 640, 0.6, "active", [
    { name: "tees-api-migrate", status: "exited", exitCode: 0 },
  ]),
  image("alpine", "latest", "be2656061b53", 12, null, "unused"),
  image("tees-api", null, "d41e8a2c7b90", 410, null, "dangling"),
  image("tees-worker", null, "6a0f3e9d1c58", 402, null, "dangling"),
  image("tees-api", null, "f87b2c5e0a14", 417, null, "dangling"),
];

export const getMockImages = () =>
  respond<ImageSummary>({
    images: IMAGES,
    totalCount: 12,
    totalBytes: 18.4 * GB,
    danglingCount: 3,
    danglingBytes: 1.2 * GB,
  });
