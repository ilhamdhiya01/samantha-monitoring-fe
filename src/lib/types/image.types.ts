import type { ContainerStatus } from "./container.types";

// active   — dipakai container
// previous — versi lain dari repo yang sedang dipakai (kandidat rollback)
// unused   — ber-tag, repo-nya tidak dipakai container mana pun
// dangling — tanpa tag (<none>), kandidat prune
export type ImageState = "active" | "previous" | "unused" | "dangling";

export interface ImageInfo {
  id: string;
  repository: string;
  // null untuk image dangling (<none>).
  tag: string | null;
  sizeBytes: number;
  createdAt: string;
  // Event `container create` terakhir, atau waktu dibuatnya container
  // pemakai kalau event-nya terjadi sebelum monitor dipasang.
  deployedAt: string | null;
  state: ImageState;
  usedBy: {
    name: string;
    status: ContainerStatus;
    exitCode: number | null;
  }[];
}

export interface ImageSummary {
  images: ImageInfo[];
  totalCount: number;
  totalBytes: number;
  danglingCount: number;
  danglingBytes: number;
}
