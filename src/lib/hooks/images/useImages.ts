import { useQuery } from "@tanstack/react-query";

import { POLL_IMAGES_MS } from "@/const/monitor.constant";
import type { ApiResponse } from "@/lib/types/api.types";
import type { ImageInfo, ImageSummary } from "@/lib/types/image.types";
import { getImages } from "@/services/images.service";

import { imageKeys } from "./queryKeys";

const STATE_ORDER: Record<ImageInfo["state"], number> = {
  active: 0,
  previous: 1,
  unused: 2,
  dangling: 3,
};

const time = (iso: string | null) => (iso ? Date.parse(iso) : 0);

// Repo yang dipakai dulu (aktif lalu versi sebelumnya, terbaru di atas),
// lalu image tak terpakai, lalu dangling.
const sortImages = (a: ImageInfo, b: ImageInfo) => {
  const rank = (image: ImageInfo) =>
    image.state === "dangling" ? 2 : image.state === "unused" ? 1 : 0;
  const byRank = rank(a) - rank(b);
  if (byRank !== 0) return byRank;
  const byRepo = a.repository.localeCompare(b.repository);
  if (byRepo !== 0) return byRepo;
  const byState = STATE_ORDER[a.state] - STATE_ORDER[b.state];
  if (byState !== 0) return byState;
  return time(b.deployedAt ?? b.createdAt) - time(a.deployedAt ?? a.createdAt);
};

const selectSummary = (response: ApiResponse<ImageSummary>) => ({
  ...response.data,
  images: [...response.data.images].sort(sortImages),
});

export const useImages = () => {
  return useQuery({
    queryKey: imageKeys.summary(),
    queryFn: getImages,
    select: selectSummary,
    refetchInterval: POLL_IMAGES_MS,
    // Segar sampai jadwal poll berikutnya: pindah menu memakai cache.
    staleTime: POLL_IMAGES_MS,
  });
};
