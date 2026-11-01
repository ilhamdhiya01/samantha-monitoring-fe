import { describe, expect, it } from "vitest";

import type { ActionStatus } from "@/lib/types/action.types";
import type { ContainerInfo } from "@/lib/types/container.types";

import { getActionAvailability } from "../action.helper";

const container = (
  status: ContainerInfo["status"],
  project: string | null = "goodenglish-be",
): ContainerInfo => ({
  id: "abc",
  name: "goodenglish-be-app-1",
  image: "goodenglish-be",
  tag: "test",
  status,
  cpuPercent: 0,
  memoryBytes: 0,
  restartCount: 0,
  startedAt: null,
  exitCode: null,
  project,
  service: "app",
  health: null,
  oomKilled: false,
  finishedAt: null,
  restartPolicy: "unless-stopped",
});

const enabled: ActionStatus = {
  enabled: true,
  disabledReason: null,
  protectedProjects: ["samantha-monitoring-be"],
};

describe("action.helper", () => {
  it("offers stop for running containers and start otherwise", () => {
    expect(getActionAvailability(container("running"), enabled)).toEqual({
      action: "stop",
      disabledReason: null,
    });
    expect(getActionAvailability(container("restarting"), enabled).action).toBe(
      "stop",
    );
    expect(getActionAvailability(container("exited"), enabled).action).toBe(
      "start",
    );
  });

  it("explains why the action is unavailable", () => {
    expect(
      getActionAvailability(container("running"), {
        ...enabled,
        enabled: false,
        disabledReason: "Aksi dimatikan (ACTIONS_ENABLED=false)",
      }).disabledReason,
    ).toMatch(/ACTIONS_ENABLED/);
    expect(
      getActionAvailability(
        container("running", "samantha-monitoring-be"),
        enabled,
      ).disabledReason,
    ).toMatch(/monitor/);
    expect(
      getActionAvailability(container("running"), undefined).disabledReason,
    ).not.toBeNull();
  });
});
