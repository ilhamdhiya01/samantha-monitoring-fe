import React, { useCallback, useMemo, useState } from "react";

import SectionCard from "@/components/shared/section-card";
import SectionMessage from "@/components/shared/section-message";
import SegmentedControl from "@/components/ui/segmented-control";
import Skeleton from "@/components/ui/skeleton";
import { formatClock } from "@/lib/helpers/format.helper";
import { groupDeploysByHour } from "@/lib/helpers/history.helper";
import { useDeploys } from "@/lib/hooks/deploys/useDeploys";
import { useErrorsHourly } from "@/lib/hooks/metrics/useErrorsHourly";

// Tinggi area batang (px).
const CHART_HEIGHT = 72;
// Indeks jam yang diberi label di sumbu X (24 batang).
const AXIS_TICKS = [0, 6, 12, 18, 23];

type Scope = "container" | "all";

const SCOPE_OPTIONS = [
  { value: "container", label: "container" },
  { value: "all", label: "semua" },
];

interface ErrorChartProps {
  container: string;
}

// Default: error container yang sedang dibuka, dengan garis di jam ada
// deploy — lonjakan setelah deploy langsung terlihat. "semua" = total host.
const ErrorChart = React.memo(({ container }: ErrorChartProps) => {
  const [scope, setScope] = useState<Scope>("container");
  const isContainer = scope === "container";
  const {
    data: chart,
    isLoading,
    isError,
  } = useErrorsHourly(isContainer ? container : undefined);
  const { data: deploys } = useDeploys(container);

  const handleScope = useCallback(
    (value: string) => setScope(value as Scope),
    [],
  );

  const deploysByHour = useMemo(
    () => groupDeploysByHour(isContainer ? (deploys ?? []) : []),
    [deploys, isContainer],
  );

  const bars = useMemo(() => {
    if (!chart) return [];
    const maxStack = Math.max(
      1,
      ...chart.hours.map((hour) => hour.errors + hour.warnings),
    );
    const unit = (CHART_HEIGHT - 4) / maxStack;
    return chart.hours.map((hour) => {
      const hourDeploys = deploysByHour.get(Date.parse(hour.hour)) ?? [];
      const deployNote = hourDeploys
        .map(
          (deploy) =>
            ` · deploy ${deploy.image} ${formatClock(deploy.occurredAt)}`,
        )
        .join("");
      return {
        key: hour.hour,
        label: `${formatClock(hour.hour)} · ${hour.errors} error, ${hour.warnings} warning${deployNote}`,
        errorHeight: Math.round(hour.errors * unit),
        warningHeight: Math.round(hour.warnings * unit),
        deployCount: hourDeploys.length,
      };
    });
  }, [chart, deploysByHour]);

  const deployCount = bars.reduce((sum, bar) => sum + bar.deployCount, 0);

  const summary = chart?.peak
    ? `Batang error dan warning per jam, 24 jam terakhir, puncak ${chart.peak.errors} error jam ${formatClock(chart.peak.hour)}`
    : "Batang error dan warning per jam, 24 jam terakhir";

  return (
    <SectionCard
      title="Error / jam, 24 jam"
      action={
        <SegmentedControl
          label="Lingkup grafik error"
          options={SCOPE_OPTIONS}
          value={scope}
          onChange={handleScope}
        />
      }
    >
      {isError && (
        <SectionMessage tone="danger">
          Gagal memuat grafik error.
        </SectionMessage>
      )}
      {!isError && (isLoading || !chart) && (
        <Skeleton className="mt-2.5 h-[72px]" />
      )}
      {chart && (
        <>
          <div
            role="img"
            aria-label={summary}
            className="mt-2.5 flex items-end gap-0.5 border-b border-line"
            style={{ height: CHART_HEIGHT }}
          >
            {bars.map((bar) => (
              <div
                key={bar.key}
                title={bar.label}
                className="relative flex h-full flex-1 flex-col justify-end"
              >
                {bar.deployCount > 0 && (
                  <div className="absolute inset-y-0 left-1/2 w-px bg-link" />
                )}
                <div
                  className="bg-warn"
                  style={{ height: bar.warningHeight }}
                />
                <div className="bg-err" style={{ height: bar.errorHeight }} />
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10.5px] text-muted">
            {AXIS_TICKS.filter((index) => index < chart.hours.length).map(
              (index) => (
                <span key={index}>{formatClock(chart.hours[index].hour)}</span>
              ),
            )}
          </div>
          <div className="mt-2 flex gap-3.5 text-[11px] text-muted">
            <span className="inline-flex items-center gap-1.25">
              <span className="size-2 bg-err" />
              error {chart.totalErrors}
            </span>
            <span className="inline-flex items-center gap-1.25">
              <span className="size-2 bg-warn" />
              warning {chart.totalWarnings}
            </span>
            {deployCount > 0 && (
              <span className="inline-flex items-center gap-1.25">
                <span className="h-2.5 w-px bg-link" />
                deploy {deployCount}
              </span>
            )}
          </div>
        </>
      )}
    </SectionCard>
  );
});

ErrorChart.displayName = "ErrorChart";

export default ErrorChart;
