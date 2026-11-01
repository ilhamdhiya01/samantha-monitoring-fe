// Endpoint backend (dipakai services/*.service.ts).
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const API_SYSTEM = `${API_BASE_URL}/api/v1/system`;
export const API_CONTAINERS = `${API_BASE_URL}/api/v1/containers`;
export const API_IMAGES = `${API_BASE_URL}/api/v1/images`;
export const API_ALERTS_ACTIVE = `${API_BASE_URL}/api/v1/alerts/active`;
// Ketiganya menerima ?container=<nama>; tanpa itu = semua container.
export const API_ALERTS_HISTORY = `${API_BASE_URL}/api/v1/alerts/history`;
export const API_ERRORS_HOURLY = `${API_BASE_URL}/api/v1/metrics/errors-hourly`;
export const API_DEPLOYS = `${API_BASE_URL}/api/v1/deploys`;
export const API_ACTIONS_STATUS = `${API_BASE_URL}/api/v1/actions/status`;
// POST, body { confirm: <nama container> }.
export const API_CONTAINER_ACTION = (container: string, action: string) =>
  `${API_BASE_URL}/api/v1/containers/${encodeURIComponent(container)}/${action}`;

// SSE: event `log` berisi satu LogLine (JSON), id = LogLine.id.
export const API_LOG_STREAM = (container: string) =>
  `${API_BASE_URL}/api/v1/logs/${encodeURIComponent(container)}/stream`;

// SSE data dashboard: event `stats`, `containers`, `alerts` (data lengkap,
// bukan selisih) dan `ping`. Menggantikan polling selama tersambung.
export const API_STREAM = `${API_BASE_URL}/api/v1/stream`;
