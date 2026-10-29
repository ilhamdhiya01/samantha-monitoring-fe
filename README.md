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

## Skrip

`pnpm lint` · `pnpm test` · `pnpm typecheck` · `pnpm build` · `pnpm format`

Konvensi kode: lihat `CLAUDE.md`.
