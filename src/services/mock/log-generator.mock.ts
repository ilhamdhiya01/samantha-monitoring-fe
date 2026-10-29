// Generator log tiruan per container. Teks meniru contoh di design;
// level dikirim apa adanya seperti hasil parser backend nanti.
import { LOG_TAIL } from "@/const/monitor.constant";
import type { LogLevel, LogLine } from "@/lib/types/log.types";

import { getMockContainerStatus } from "./data.mock";

type Template = [weight: number, level: LogLevel, render: () => string];

const pick = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const between = (min: number, max: number) =>
  Math.round(min + Math.random() * (max - min));
const ip = () => `103.xx.xx.${between(10, 99)}`;

const PRODUCTS_PATHS = [
  "/api/products",
  "/api/products?page=2",
  "/api/products/kaos-polos-hitam",
  "/api/categories",
  "/api/cart",
];

const TEMPLATES: Record<string, Template[]> = {
  "tees-api": [
    [
      30,
      "INFO",
      () =>
        `[gunicorn] ${ip()} "GET ${pick(PRODUCTS_PATHS)} HTTP/1.1" 200 ${between(20, 90)}ms`,
    ],
    [
      8,
      "INFO",
      () =>
        `[gunicorn] ${ip()} "POST /api/orders HTTP/1.1" 201 ${between(80, 180)}ms`,
    ],
    [
      6,
      "INFO",
      () =>
        `[gunicorn] 127.0.0.1 "GET /api/health HTTP/1.1" 200 ${between(2, 6)}ms`,
    ],
    [
      3,
      "WARN",
      () =>
        `sqlalchemy.engine slow query ${(Math.random() * 2 + 1).toFixed(2)}s: SELECT orders.* FROM orders WHERE store_id = %s ORDER BY created_at DESC`,
    ],
    [
      2,
      "WARN",
      () =>
        `ratelimit 429 for ${ip()} on /api/auth/login (${between(25, 40)} req/min)`,
    ],
    [
      1,
      "ERROR",
      () =>
        `psycopg2.OperationalError: connection to server at "postgres" (172.18.0.4), port 5432 failed: timeout expired`,
    ],
    [
      1,
      "ERROR",
      () =>
        `Traceback (most recent call last): File "/app/api/checkout.py", line 88, in create_checkout  KeyError: 'shipping_cost'`,
    ],
    [
      1,
      "ERROR",
      () =>
        `[gunicorn] ${ip()} "POST /api/checkout HTTP/1.1" 500 ${between(40, 90)}ms`,
    ],
    [2, "INFO", () => "db.pool retrying connection (1/3) in 2.0s"],
    [2, "INFO", () => "db.pool connection restored"],
  ],
  "tees-worker": [
    [4, "INFO", () => "worker boot, queue=orders concurrency=2"],
    [
      4,
      "ERROR",
      () =>
        "redis.exceptions.ConnectionError: Error 111 connecting to redis:6379. Connection refused.",
    ],
    [2, "ERROR", () => "worker exited with code 1"],
  ],
  nginx: [
    [
      30,
      "INFO",
      () =>
        `tees.co.id ${ip()} "GET ${pick(["/", "/produk", "/keranjang", "/static/app.js"])} HTTP/2.0" 200 ${between(800, 9000)} "Mozilla/5.0"`,
    ],
    [
      3,
      "WARN",
      () =>
        `upstream response time ${(Math.random() * 2 + 1).toFixed(3)}s for /api/orders`,
    ],
    [
      2,
      "WARN",
      () => `tees.co.id ${ip()} "GET /wp-login.php HTTP/1.1" 404 153 "-"`,
    ],
    [
      1,
      "ERROR",
      () => `tees.co.id ${ip()} "POST /api/checkout HTTP/2.0" 500 212`,
    ],
  ],
  postgres: [
    [6, "INFO", () => "LOG:  checkpoint starting: time"],
    [
      6,
      "INFO",
      () =>
        `LOG:  checkpoint complete: wrote ${between(10, 300)} buffers (${(Math.random() * 2).toFixed(1)}%)`,
    ],
    [
      2,
      "WARN",
      () =>
        "LOG:  could not receive data from client: Connection reset by peer",
    ],
  ],
  redis: [
    [6, "INFO", () => `* Background saving started by pid ${between(20, 90)}`],
    [6, "INFO", () => "* DB saved on disk"],
    [
      2,
      "WARN",
      () => `# WARNING memory usage ${between(85, 95)}% of maxmemory (256mb)`,
    ],
  ],
};

// Jeda rata-rata antarbaris per container (ms).
const INTERVAL: Record<string, [number, number]> = {
  "tees-api": [300, 1500],
  "tees-worker": [2500, 4000],
  nginx: [200, 900],
  postgres: [4000, 9000],
  redis: [3000, 8000],
};

let sequence = 0;

const createLine = (container: string, time: number): LogLine => {
  const templates = TEMPLATES[container] ?? TEMPLATES.redis;
  const totalWeight = templates.reduce((sum, [weight]) => sum + weight, 0);
  let roll = Math.random() * totalWeight;
  const [, level, render] =
    templates.find(([weight]) => (roll -= weight) < 0) ?? templates[0];
  sequence += 1;
  return {
    id: `${time}-${sequence}`,
    ts: new Date(time).toISOString(),
    level,
    text: render(),
  };
};

const createTail = (container: string, count: number) => {
  const [min, max] = INTERVAL[container] ?? [1000, 3000];
  const lines: LogLine[] = [];
  let time = Date.now();
  for (let index = 0; index < count; index += 1) {
    time -= between(min, max);
    lines.push(createLine(container, time));
  }
  return lines.reverse();
};

export interface MockLogStreamHandlers {
  lastId?: string;
  onOpen: () => void;
  onLines: (lines: LogLine[]) => void;
}

// Meniru EventSource: buka → kirim tail → kirim baris baru berkala.
// Mengembalikan fungsi close.
export const openMockLogStream = (
  container: string,
  { lastId, onOpen, onLines }: MockLogStreamHandlers,
) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const [min, max] = INTERVAL[container] ?? [1000, 3000];
  const isStopped = getMockContainerStatus(container) === "exited";

  const tick = () => {
    onLines([createLine(container, Date.now())]);
    timer = setTimeout(tick, between(min, max));
  };

  timer = setTimeout(() => {
    onOpen();
    // Reconnect dengan Last-Event-ID tidak mengirim ulang tail.
    if (!lastId) onLines(createTail(container, LOG_TAIL));
    if (!isStopped) timer = setTimeout(tick, between(min, max));
  }, 200);

  return () => clearTimeout(timer);
};
