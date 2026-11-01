import React, { useMemo } from "react";

import SectionCard from "@/components/shared/section-card";
import SectionMessage from "@/components/shared/section-message";
import Skeleton from "@/components/ui/skeleton";
import StatusDot from "@/components/ui/status-dot";
import {
  formatDateTime,
  formatDuration,
  formatRelative,
} from "@/lib/helpers/format.helper";
import type { TimelineItem } from "@/lib/helpers/history.helper";
import { buildContainerTimeline } from "@/lib/helpers/history.helper";
import { useAlertHistory } from "@/lib/hooks/alerts/useAlertHistory";
import { useDeploys } from "@/lib/hooks/deploys/useDeploys";
import { useNow } from "@/lib/hooks/useNow";

const META = "mt-0.5 font-mono text-[10.5px] text-muted";

interface TimelineRowProps {
  item: TimelineItem;
  now: number;
}

const TimelineRow = ({ item, now }: TimelineRowProps) => {
  const when = `${formatDateTime(item.time)} · ${formatRelative(item.time, now)}`;

  if (item.kind === "deploy") {
    return (
      <li className="flex gap-2.5 border-b border-line-soft py-2">
        <span aria-hidden className="mt-1 h-2.5 w-px shrink-0 bg-link" />
        <div className="min-w-0">
          <div className="text-[12.5px]">
            Deploy{" "}
            <span className="font-mono text-xs">{item.deploy.image}</span>
          </div>
          <div className={META}>{when}</div>
        </div>
      </li>
    );
  }

  const { alert } = item;
  const resolvedIn = alert.resolvedAt
    ? formatDuration(
        (Date.parse(alert.resolvedAt) - Date.parse(alert.firedAt)) / 1000,
      )
    : null;

  return (
    <li className="flex gap-2.5 border-b border-line-soft py-2">
      <StatusDot
        tone={
          alert.resolvedAt
            ? "muted"
            : alert.severity === "critical"
              ? "err"
              : "warn"
        }
        className="mt-1.25"
      />
      <div className="min-w-0">
        <div className="text-[12.5px] font-medium">{alert.title}</div>
        <div className="text-xs text-fg-secondary">{alert.description}</div>
        <div className={META}>
          {when} ·{" "}
          {resolvedIn ? (
            `pulih setelah ${resolvedIn}`
          ) : (
            <span className="text-err">masih aktif</span>
          )}
        </div>
      </div>
    </li>
  );
};

interface ContainerHistoryProps {
  container: string;
}

// Riwayat satu container: deploy dan alert (termasuk yang sudah pulih).
const ContainerHistory = React.memo(({ container }: ContainerHistoryProps) => {
  const deploys = useDeploys(container);
  const alerts = useAlertHistory(container);
  const now = useNow(30_000);

  const timeline = useMemo(
    () => buildContainerTimeline(deploys.data ?? [], alerts.data ?? []),
    [deploys.data, alerts.data],
  );

  const isError = deploys.isError && alerts.isError;
  const isLoading = deploys.isLoading || alerts.isLoading;

  return (
    <SectionCard title="Riwayat container">
      {isError && (
        <SectionMessage tone="danger">Gagal memuat riwayat.</SectionMessage>
      )}
      {!isError && isLoading && (
        <div className="flex flex-col gap-2 py-2.5">
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </div>
      )}
      {!isError && !isLoading && timeline.length === 0 && (
        <SectionMessage>Belum ada deploy atau alert.</SectionMessage>
      )}
      {!isLoading && timeline.length > 0 && (
        <ul className="m-0 list-none p-0">
          {timeline.map((item) => (
            <TimelineRow key={item.id} item={item} now={now} />
          ))}
        </ul>
      )}
      <div className="pt-2 text-[11px] text-muted">
        Dicatat sejak monitor dipasang
      </div>
    </SectionCard>
  );
});

ContainerHistory.displayName = "ContainerHistory";

export default ContainerHistory;
