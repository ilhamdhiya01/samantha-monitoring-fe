import { Link } from "@tanstack/react-router";
import React from "react";

import SectionCard from "@/components/shared/section-card";
import SectionMessage from "@/components/shared/section-message";
import Skeleton from "@/components/ui/skeleton";
import StatusDot from "@/components/ui/status-dot";
import { formatClock, formatRelative } from "@/lib/helpers/format.helper";
import { useActiveAlerts } from "@/lib/hooks/alerts/useActiveAlerts";
import { useNow } from "@/lib/hooks/useNow";

interface ActiveAlertsProps {
  // Tampilkan link "riwayat" (disembunyikan di halaman Alert sendiri).
  showHistoryLink?: boolean;
}

const ActiveAlerts = React.memo(
  ({ showHistoryLink = true }: ActiveAlertsProps) => {
    const { data: alerts, isLoading, isError } = useActiveAlerts();
    const now = useNow(30_000);

    const historyLink = showHistoryLink ? (
      <Link to="/alerts" className="text-[11px] text-link">
        riwayat
      </Link>
    ) : undefined;

    return (
      <SectionCard id="alerts" title="Alert aktif" action={historyLink}>
        {isError && (
          <SectionMessage tone="danger">Gagal memuat alert.</SectionMessage>
        )}
        {!isError && (isLoading || !alerts) && (
          <div className="flex flex-col gap-2 py-2.5">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        )}
        {alerts?.length === 0 && (
          <SectionMessage>Tidak ada alert aktif.</SectionMessage>
        )}
        {alerts && alerts.length > 0 && (
          <ul className="m-0 list-none p-0">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="flex gap-2.5 border-b border-line-soft py-2.5"
              >
                <StatusDot
                  tone={alert.severity === "critical" ? "err" : "warn"}
                  className="mt-1.25"
                />
                <div className="min-w-0">
                  <div className="text-[12.5px] font-medium">{alert.title}</div>
                  <div className="text-xs text-fg-secondary">
                    {alert.description}
                  </div>
                  <div className="mt-0.5 font-mono text-[10.5px] text-muted">
                    {formatClock(alert.firedAt)} ·{" "}
                    {formatRelative(alert.firedAt, now)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="pt-2 text-[11px] text-muted">
          Dikirim ke Telegram · cooldown 30 mnt
        </div>
      </SectionCard>
    );
  },
);

ActiveAlerts.displayName = "ActiveAlerts";

export default ActiveAlerts;
