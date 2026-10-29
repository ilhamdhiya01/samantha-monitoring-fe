// Endpoint backend (dipakai services/*.service.ts).
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const API_SYSTEM = `${API_BASE_URL}/api/v1/system`;
export const API_CONTAINERS = `${API_BASE_URL}/api/v1/containers`;
export const API_IMAGES = `${API_BASE_URL}/api/v1/images`;
export const API_ALERTS_ACTIVE = `${API_BASE_URL}/api/v1/alerts/active`;
export const API_ERRORS_HOURLY = `${API_BASE_URL}/api/v1/metrics/errors-hourly`;

// SSE: event `log` berisi satu LogLine (JSON), id = LogLine.id.
export const API_LOG_STREAM = (container: string) =>
  `${API_BASE_URL}/api/v1/logs/${encodeURIComponent(container)}/stream`;

// SSE data dashboard: event `stats`, `containers`, `alerts` (data lengkap,
// bukan selisih) dan `ping`. Menggantikan polling selama tersambung.
export const API_STREAM = `${API_BASE_URL}/api/v1/stream`;
