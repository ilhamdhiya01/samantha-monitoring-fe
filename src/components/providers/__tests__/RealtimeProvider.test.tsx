import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { alertKeys } from "@/lib/hooks/alerts/queryKeys";
import { containerKeys } from "@/lib/hooks/containers/queryKeys";
import { systemKeys } from "@/lib/hooks/system/queryKeys";
import { useRealtimeStatus } from "@/lib/hooks/useRealtimeStatus";

import RealtimeProvider from "../RealtimeProvider";

class FakeEventSource {
  static readonly CLOSED = 2;
  static instances: FakeEventSource[] = [];

  readyState = 0;
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  isClosed = false;
  private readonly listeners = new Map<string, (event: Event) => void>();

  constructor(readonly url: string) {
    FakeEventSource.instances.push(this);
  }

  addEventListener(type: string, listener: (event: Event) => void) {
    this.listeners.set(type, listener);
  }

  removeEventListener(type: string) {
    this.listeners.delete(type);
  }

  close() {
    this.isClosed = true;
  }

  emit(type: string, data: unknown) {
    this.listeners.get(type)?.(
      new MessageEvent(type, { data: JSON.stringify(data) }),
    );
  }
}

const StatusProbe = () => <span>{useRealtimeStatus()}</span>;

const renderProvider = () => {
  const queryClient = new QueryClient();
  const view = render(
    <QueryClientProvider client={queryClient}>
      <RealtimeProvider>
        <StatusProbe />
      </RealtimeProvider>
    </QueryClientProvider>,
  );
  return { queryClient, view, source: FakeEventSource.instances[0] };
};

describe("RealtimeProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    FakeEventSource.instances = [];
    vi.stubGlobal("EventSource", FakeEventSource);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("opens one stream and reports open", () => {
    const { source } = renderProvider();

    expect(FakeEventSource.instances).toHaveLength(1);
    expect(source.url).toContain("/api/v1/stream");
    expect(screen.getByText("connecting")).toBeInTheDocument();

    act(() => source.onopen?.());
    expect(screen.getByText("open")).toBeInTheDocument();
  });

  it("writes events into the query cache in REST shape", () => {
    const { queryClient, source } = renderProvider();
    const stats = { hostname: "vps-01" };
    const containers = [{ name: "tees-api" }];
    const alerts = [{ id: "a1" }];

    act(() => {
      source.emit("stats", stats);
      source.emit("containers", containers);
      source.emit("alerts", alerts);
    });

    expect(queryClient.getQueryData(systemKeys.stats())).toEqual({
      data: stats,
    });
    expect(queryClient.getQueryData(containerKeys.list())).toEqual({
      data: containers,
    });
    expect(queryClient.getQueryData(alertKeys.active())).toEqual({
      data: alerts,
    });
  });

  it("falls back to polling and reopens after the browser gives up", () => {
    const { source } = renderProvider();
    act(() => source.onopen?.());

    source.readyState = FakeEventSource.CLOSED;
    act(() => source.onerror?.());

    expect(screen.getByText("unavailable")).toBeInTheDocument();
    expect(source.isClosed).toBe(true);

    act(() => vi.advanceTimersByTime(3_000));
    expect(FakeEventSource.instances).toHaveLength(2);
  });

  it("closes the stream on unmount", () => {
    const { view, source } = renderProvider();
    view.unmount();
    expect(source.isClosed).toBe(true);
  });
});
