# VPS Docker Monitor — Frontend

Dashboard satu halaman untuk memantau VPS dan container Docker: resource VPS, daftar container, live log (SSE), error per jam, alert aktif, serta image & riwayat deploy.

## Menjalankan

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Selama backend belum ada, data diambil dari mock (`VITE_USE_MOCK=true` di `.env.development`). Set `VITE_USE_MOCK=false` untuk memakai backend NestJS; `/api` di-proxy ke `http://localhost:3001` (backend: `dashboard-monitoring-be`) (lihat `vite.config.ts`).

## Kontrak API yang dipakai

| Endpoint                              | Tipe                                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/v1/system`                  | `SystemStats`                                                                                                                   |
| `GET /api/v1/containers`              | `ContainerInfo[]`                                                                                                               |
| `GET /api/v1/images`                  | `ImageSummary`                                                                                                                  |
| `GET /api/v1/alerts/active`           | `Alert[]`                                                                                                                       |
| `GET /api/v1/metrics/errors-hourly`   | `ErrorHour[]` (24 jam)                                                                                                          |
| `GET /api/v1/stream` (SSE)            | event `stats` → `SystemStats`, `containers` → `ContainerInfo[]`, `alerts` → `Alert[]`; selama tersambung polling ketiganya mati |
| `GET /api/v1/logs/:name/stream` (SSE) | event `log` → `LogLine`, `id` = `LogLine.id`; juga `skipped` (`{ count }`) dan `ping`                                           |

Semua respons REST berbentuk `{ data: T, message }`; error `{ errors: [{ field, message }] }`. Tipe ada di `src/lib/types/`.

## Deploy

Image `ghcr.io/ilhamdhiya01/samantha-monitoring-fe:latest` = hasil `vite build` (mock mati, API satu origin) di Nginx (`deploy/nginx.conf`): menyajikan SPA dan meneruskan `/api/v1` ke `monitor-api` lewat network Docker `monitor` milik compose BE, tanpa buffer untuk SSE. GitHub Actions membangun image lalu SSH ke VPS dan menjalankan `docker compose pull && up -d` di `~/dashboard-monitoring/samantha-monitoring-fe` (secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`). Jalankan BE lebih dulu.

Belum ada login: container hanya di `127.0.0.1:3310`. Buka lewat `ssh -L 3310:127.0.0.1:3310 ubuntu@<vps>` → `http://localhost:3310`.

## Skrip

`pnpm lint` · `pnpm test` · `pnpm typecheck` · `pnpm build` · `pnpm format`

Konvensi kode: lihat `CLAUDE.md`.
