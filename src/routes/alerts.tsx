import { createFileRoute } from "@tanstack/react-router";

import { Monitor } from "@/components/features/monitor";
import EmptyState from "@/components/shared/empty-state";

const AlertsPage = () => (
  <div className="flex flex-1 flex-col">
    <div className="border-b border-line bg-panel">
      <Monitor.ActiveAlerts showHistoryLink={false} />
    </div>
    <EmptyState
      title="Riwayat alert"
      description="Riwayat alert yang sudah selesai menyusul di v1.1."
    />
  </div>
);

export const Route = createFileRoute("/alerts")({ component: AlertsPage });
