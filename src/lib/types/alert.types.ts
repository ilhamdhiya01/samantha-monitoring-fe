export type AlertKind =
  "container_exited" | "restart_loop" | "disk_usage" | "error_spike";

export type AlertSeverity = "critical" | "warning";

export interface Alert {
  id: string;
  kind: AlertKind;
  severity: AlertSeverity;
  title: string;
  description: string;
  container: string | null;
  firedAt: string;
}
