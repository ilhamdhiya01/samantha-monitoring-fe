import { describe, expect, it } from "vitest";

import type { AlertHistoryItem } from "@/lib/types/alert.types";
import type { DeployEvent } from "@/lib/types/deploy.types";

import {
  buildContainerTimeline,
  groupDeploysByHour,
  startOfHour,
} from "../history.helper";

const deploy = (id: string, occurredAt: string): DeployEvent => ({
  id,
  container: "goodenglish-be-app-1",
  image: "goodenglish-be:test",
  occurredAt,
});

const alert = (id: string, firedAt: string): AlertHistoryItem => ({
  id,
  kind: "container_exited",
  severity: "critical",
  title: "app berhenti",
  description: "exit 137",
  container: "goodenglish-be-app-1",
  firedAt,
  resolvedAt: null,
});

describe("history.helper", () => {
  it("merges deploys and alerts newest first, capped", () => {
    const timeline = buildContainerTimeline(
      [
        deploy("d1", "2026-10-29T08:00:00.000Z"),
        deploy("d2", "2026-10-29T10:00:00.000Z"),
      ],
      [alert("a1", "2026-10-29T10:05:00.000Z")],
      2,
    );

    expect(timeline.map((item) => item.id)).toEqual(["alert:a1", "deploy:d2"]);
  });

  it("buckets deploys by the hour they happened in", () => {
    const byHour = groupDeploysByHour([
      deploy("d1", "2026-10-29T10:02:00.000Z"),
      deploy("d2", "2026-10-29T10:59:00.000Z"),
      deploy("d3", "2026-10-29T11:00:00.000Z"),
    ]);
    const ten = startOfHour(Date.parse("2026-10-29T10:30:00.000Z"));

    expect(byHour.get(ten)?.map((item) => item.id)).toEqual(["d1", "d2"]);
    expect(byHour.size).toBe(2);
  });
});
