import { describe, expect, it } from "vitest";

import {
  getRestartTone,
  getStatusLabel,
  getStatusTone,
  isFinished,
  getUsageTone,
  toPercent,
} from "../threshold.helper";

describe("threshold.helper", () => {
  it("switches colour at 70% and 85%", () => {
    expect(getUsageTone(34)).toBe("ok");
    expect(getUsageTone(70)).toBe("warn");
    expect(getUsageTone(85)).toBe("warn");
    expect(getUsageTone(85.1)).toBe("err");
  });

  it("maps container status to tone", () => {
    expect(getStatusTone("running")).toBe("ok");
    expect(getStatusTone("restarting")).toBe("warn");
    expect(getStatusTone("exited")).toBe("err");
  });

  it("treats exit 0 as a finished job, not a failure", () => {
    expect(isFinished("exited", 0)).toBe(true);
    expect(isFinished("exited", 1)).toBe(false);
    expect(getStatusTone("exited", 0)).toBe("muted");
    expect(getStatusTone("exited", 137)).toBe("err");
    expect(getStatusLabel("exited", 0)).toBe("selesai");
    expect(getStatusLabel("exited", 1)).toBe("exited (1)");
    expect(getStatusLabel("running", null)).toBe("running");
  });

  it("flags more than 5 restarts", () => {
    expect(getRestartTone(5)).toBe("warn");
    expect(getRestartTone(6)).toBe("err");
  });

  it("guards division by zero", () => {
    expect(toPercent(1, 0)).toBe(0);
    expect(toPercent(4, 5)).toBe(80);
  });
});
