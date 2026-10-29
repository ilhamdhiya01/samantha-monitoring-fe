import React, { useMemo } from "react";

import SectionCard from "@/components/shared/section-card";
import SectionMessage from "@/components/shared/section-message";
import Skeleton from "@/components/ui/skeleton";
import { formatClock } from "@/lib/helpers/format.helper";
import { useErrorsHourly } from "@/lib/hooks/metrics/useErrorsHourly";

// Tinggi area batang (px).
const CHART_HEIGHT = 72;
// Indeks jam yang diberi label di sumbu X (24 batang).
const AXIS_TICKS = [0, 6, 12, 18, 23];

const ErrorChart = React.memo(() => {
  const { data: chart, isLoading, isError } = useErrorsHourly();

  const bars = useMemo(() => {
    if (!chart) return [];
    const maxStack = Math.max(
      1,
      ...chart.hours.map((hour) => hour.errors + hour.warnings),
    );
    const unit = (CHART_HEIGHT - 4) / maxStack;
    return chart.hours.map((hour) => ({
      key: hour.hour,
      label: `${formatClock(hour.hour)} · ${hour.errors} error, ${hour.warnings} warning`,
      errorHeight: Math.round(hour.errors * unit),
      warningHeight: Math.round(hour.warnings * unit),
    }));
  }, [chart]);

  const summary = chart?.peak
    ? `Batang error dan warning per jam, 24 jam terakhir, puncak ${chart.peak.errors} error jam ${formatClock(chart.peak.hour)}`
    : "Batang error dan warning per jam, 24 jam terakhir";

  return (
    <SectionCard title="Error / jam, 24 jam" meta="semua container">
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
                className="flex h-full flex-1 flex-col justify-end"
              >
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
          </div>
        </>
      )}
    </SectionCard>
  );
});

ErrorChart.displayName = "ErrorChart";

export default ErrorChart;
