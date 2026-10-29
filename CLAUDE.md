# CLAUDE.md

Dashboard VPS Docker Monitor (FE). SPA Vite + React 19 + TanStack Router (file-based) + TanStack Query + Tailwind 4. Konvensi mengikuti `critiq-fe`, disesuaikan untuk Vite.

## Perintah

Pakai **pnpm**.

```bash
pnpm dev          # http://localhost:3000, data mock (VITE_USE_MOCK=true di .env.development)
pnpm lint         # WAJIB lolos sebelum selesai
pnpm test         # WAJIB lolos sebelum selesai
pnpm typecheck
pnpm format
```

## Penempatan file (semua di `src/`, import pakai `@/`)

| Bikin apa                          | Taruh di                                                             |
| ---------------------------------- | -------------------------------------------------------------------- |
| Primitif (button, meter, input)    | `components/ui/<kebab>/`                                             |
| Reusable lintas fitur              | `components/shared/<kebab>/`                                         |
| Komponen domain                    | `components/features/<domain>/`                                      |
| Provider                           | `components/providers/`                                              |
| Hook data (query) + `queryKeys.ts` | `lib/hooks/<domain>/`                                                |
| Hook utility                       | `lib/hooks/`                                                         |
| Pemanggil API                      | `services/<domain>.service.ts`                                       |
| Data tiruan                        | `services/mock/`                                                     |
| Tipe                               | `lib/types/<domain>.types.ts`                                        |
| Helper murni                       | `lib/helpers/<domain>.helper.ts`                                     |
| Konstanta                          | `const/<nama>.constant.ts`                                           |
| Endpoint API                       | `endpoints.ts` (bukan `routes.ts` — bentrok dengan folder `routes/`) |
| Route (pengganti `page.tsx`)       | `routes/` — hanya mengkomposisi namespace feature                    |

- Folder kebab-case, file komponen PascalCase, non-komponen dotted suffix (`log.helper.ts`).
- Setiap folder komponen punya `index.tsx` barrel. `ui`/`shared` → `export { default } from "./X"`; `features` → namespace (`Monitor.LogViewer`).
- `ui` pakai `forwardRef`, `shared`/`features` pakai `React.memo`; keduanya set `displayName`.

## Gaya kode

- Semua fungsi arrow function; dilarang `export default function` (ESLint menolak).
- Urutan import diatur `simple-import-sort`.
- Conditional class → `classnames`; varian → `tailwind-variants` (`tv`). Tidak ada `cn()`.
- Handler/objek yang dikirim ke komponen memo dibungkus `useCallback`/`useMemo`.
- Setiap efek yang mendaftarkan sesuatu (EventSource, timer, listener) wajib cleanup.

## Styling & tema

- Hanya class token (`bg-panel`, `text-muted`, `border-line`, `text-err`…), tanpa hex. Token di `src/styles.css`.
- Dua tema lewat `[data-theme]` di `<html>` — **jangan** pakai varian `dark:`. Tambah warna = tambah var di kedua blok tema + `@theme inline`.
- Console log selalu gelap (token `log-*`).

## Data

- Alur: `services → lib/hooks → komponen`. Komponen tidak memanggil axios/EventSource langsung.
- Service mengembalikan `ApiResponse<T>`; `USE_MOCK` memilih `services/mock`.
- Transformasi data di `select` query hook. Satu query key per data (container list dipakai banyak komponen).
- Data poll: Query `refetchInterval`. System, containers, alert aktif juga datang lewat SSE `/api/v1/stream` (`RealtimeProvider` → `setQueryData` dengan key yang sama); selama tersambung polling dan refetch-on-focus mati lewat `useLivePollOptions`, hidup lagi otomatis saat putus. Mode mock tidak membuka stream. Log: SSE lewat `useLogStream` → ring buffer (`log-buffer.helper.ts`) → `useSyncExternalStore`. Jangan masukkan baris log ke Query cache.
- Urutan state di komponen: error → skeleton → kosong.
- Isi log selalu dirender sebagai teks; jangan `dangerouslySetInnerHTML`.

## Scope

MVP baca-saja. Aksi tulis (rollback, prune, restart) tampil disabled dengan `V11_ACTION_HINT` sampai v1.1.
