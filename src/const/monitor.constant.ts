import type { LogLevelFilter } from "@/lib/types/log.types";

// Pakai data tiruan (services/mock) selama backend belum ada.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// Interval refresh sesuai PRD.
export const POLL_SYSTEM_MS = 5_000;
export const POLL_CONTAINERS_MS = 5_000;
export const POLL_ALERTS_MS = 15_000;
export const POLL_IMAGES_MS = 30_000;
export const POLL_ERRORS_MS = 60_000;

// Ambang warna kartu resource (persen).
export const USAGE_WARN_PCT = 70;
export const USAGE_CRITICAL_PCT = 85;

// Restart di atas ini ditandai merah.
export const RESTART_FLAG_COUNT = 5;

// Baris yang dimuat saat log dibuka, dan batas buffer di browser.
export const LOG_TAIL = 500;
export const LOG_BUFFER_MAX = 5_000;

export const LOG_LEVEL_FILTERS: LogLevelFilter[] = [
  "ALL",
  "ERROR",
  "WARN",
  "INFO",
];

// Jeda reconnect stream log setelah error berturut-turut.
export const LOG_STREAM_BACKOFF_MS = [1_000, 3_000, 10_000, 30_000];

export const SEARCH_DEBOUNCE_MS = 200;

export const V11_ACTION_HINT = "Tersedia di v1.1";

// Jeda membuka ulang SSE /stream setelah EventSource menyerah. Selama
// putus, polling biasa jalan lagi.
export const REALTIME_BACKOFF_MS = [3_000, 10_000, 30_000, 60_000];
