import type { ContainerStatus } from "./container.types";

export type ImageState = "active" | "previous" | "dangling";

export interface ImageInfo {
  id: string;
  repository: string;
  // null untuk image dangling (<none>).
  tag: string | null;
  sizeBytes: number;
  createdAt: string;
  // Waktu container terakhir dibuat dari image ini (event `container create`).
  deployedAt: string | null;
  state: ImageState;
  usedBy: { name: string; status: ContainerStatus }[];
}

export interface ImageSummary {
  images: ImageInfo[];
  totalCount: number;
  totalBytes: number;
  danglingCount: number;
  danglingBytes: number;
}
