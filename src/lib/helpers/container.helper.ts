import type { Tone } from "@/lib/helpers/threshold.helper";
import { getStatusTone } from "@/lib/helpers/threshold.helper";
import type { ContainerInfo } from "@/lib/types/container.types";

export type ContainerNavEntry =
  | { kind: "project"; name: string; containers: ContainerInfo[] }
  | { kind: "container"; container: ContainerInfo };

const entryName = (entry: ContainerNavEntry) =>
  entry.kind === "project" ? entry.name : entry.container.name;

const serviceName = (container: ContainerInfo) =>
  container.service ?? container.name;

// Seperti Docker Desktop: container satu compose project jadi satu grup,
// container di luar compose berdiri sendiri. Grup dan container tunggal
// diurutkan bersama menurut nama; isi grup menurut nama service.
export const groupContainersByProject = (
  containers: ContainerInfo[],
): ContainerNavEntry[] => {
  const projects = new Map<string, ContainerInfo[]>();
  const entries: ContainerNavEntry[] = [];

  containers.forEach((container) => {
    if (container.project === null) {
      entries.push({ kind: "container", container });
      return;
    }
    const list = projects.get(container.project);
    if (list) {
      list.push(container);
      return;
    }
    const created = [container];
    projects.set(container.project, created);
    entries.push({
      kind: "project",
      name: container.project,
      containers: created,
    });
  });

  projects.forEach((list) =>
    list.sort((a, b) => serviceName(a).localeCompare(serviceName(b))),
  );
  return entries.sort((a, b) => entryName(a).localeCompare(entryName(b)));
};

const TONE_RANK: Record<Tone, number> = { err: 3, warn: 2, ok: 1, muted: 0 };

// Warna grup = kondisi terburuk anggotanya; job yang selesai normal (exit 0)
// tidak membuat grup tampak bermasalah.
export const getProjectTone = (containers: ContainerInfo[]): Tone =>
  containers.reduce<Tone>((worst, container) => {
    const tone = getStatusTone(
      container.status,
      container.exitCode,
      container.health,
    );
    return TONE_RANK[tone] > TONE_RANK[worst] ? tone : worst;
  }, "muted");

export const countRunning = (containers: ContainerInfo[]) =>
  containers.filter((container) => container.status === "running").length;
