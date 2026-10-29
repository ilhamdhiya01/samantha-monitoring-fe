import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { LogLine as LogLineData } from "@/lib/types/log.types";

import LogLine from "../LogViewer/LogLine";

const line = (text: string, level: LogLineData["level"] = "INFO") => ({
  id: "1",
  ts: "2026-10-29T10:42:01.221Z",
  level,
  text,
});

describe("LogLine", () => {
  it("renders log content as text, never as HTML", () => {
    const { container } = render(
      <LogLine line={line('<img src=x onerror="alert(1)">')} query="" />,
    );

    expect(container.querySelector("img")).toBeNull();
    expect(
      screen.getByText('<img src=x onerror="alert(1)">'),
    ).toBeInTheDocument();
  });

  it("wraps search matches in <mark>", () => {
    const { container } = render(
      <LogLine line={line("connection timeout expired")} query="timeout" />,
    );

    const marks = container.querySelectorAll("mark");
    expect(marks).toHaveLength(1);
    expect(marks[0]).toHaveTextContent("timeout");
  });

  it("highlights ERROR rows", () => {
    const { container } = render(
      <LogLine line={line("KeyError: 'shipping_cost'", "ERROR")} query="" />,
    );

    expect(container.firstElementChild).toHaveClass("bg-log-error-bg");
    expect(screen.getByText("ERROR")).toHaveClass("text-log-error");
  });
});
