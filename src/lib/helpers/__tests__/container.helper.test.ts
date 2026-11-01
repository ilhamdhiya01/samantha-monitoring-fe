import { describe, expect, it } from "vitest";

import type { ContainerInfo } from "@/lib/types/container.types";

import {
  countRunning,
  getProjectTone,
  groupContainersByProject,
} from "../container.helper";

const container = (
  name: string,
  project: string | null,
  service: string | null,
  status: ContainerInfo["status"] = "running",
  exitCode: number | null = null,
): ContainerInfo => ({
  id: name,
  name,
  image: name,
  tag: "latest",
  status,
  cpuPercent: 0,
  memoryBytes: 0,
  restartCount: 0,
  startedAt: null,
  exitCode,
  project,
  service,
  health: null,
  oomKilled: false,
  finishedAt: null,
  restartPolicy: "no",
});

describe("container.helper", () => {
  it("groups compose containers per project and keeps the rest standalone", () => {
    const entries = groupContainersByProject([
      container("goodenglish-be-migrate-1", "goodenglish-be", "migrate"),
      container("test", null, null),
      container("goodenglish-be-app-1", "goodenglish-be", "app"),
      container("critiq-be-redis-1", "critiq-be", "redis"),
      container("goodenglish-be-db-1", "goodenglish-be", "db"),
    ]);

    expect(
      entries.map((entry) =>
        entry.kind === "project" ? entry.name : entry.container.name,
      ),
    ).toEqual(["critiq-be", "goodenglish-be", "test"]);

    const goodenglish = entries[1];
    expect(goodenglish.kind).toBe("project");
    if (goodenglish.kind === "project") {
      expect(goodenglish.containers.map((item) => item.service)).toEqual([
        "app",
        "db",
        "migrate",
      ]);
    }
  });

  it("colours a project by its worst member, ignoring finished jobs", () => {
    expect(
      getProjectTone([
        container("db", "p", "db"),
        container("migrate", "p", "migrate", "exited", 0),
      ]),
    ).toBe("ok");
    expect(
      getProjectTone([
        container("db", "p", "db"),
        container("app", "p", "app", "exited", 137),
      ]),
    ).toBe("err");
    expect(getProjectTone([container("app", "p", "app", "exited", 0)])).toBe(
      "muted",
    );
  });

  it("counts running containers", () => {
    expect(
      countRunning([
        container("db", "p", "db"),
        container("app", "p", "app", "exited", 137),
      ]),
    ).toBe(1);
  });
});
