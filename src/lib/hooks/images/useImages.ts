import { useQuery } from "@tanstack/react-query";

import { POLL_IMAGES_MS } from "@/const/monitor.constant";
import type { ApiResponse } from "@/lib/types/api.types";
import type { ImageInfo, ImageSummary } from "@/lib/types/image.types";
import { getImages } from "@/services/images.service";

import { imageKeys } from "./queryKeys";

const STATE_ORDER: Record<ImageInfo["state"], number> = {
  active: 0,
  previous: 1,
  dangling: 2,
};

const time = (iso: string | null) => (iso ? Date.parse(iso) : 0);

// Per repo, image aktif dulu lalu yang sebelumnya (terbaru di atas);
// dangling di paling bawah.
const sortImages = (a: ImageInfo, b: ImageInfo) => {
  const isDangling =
    Number(a.state === "dangling") - Number(b.state === "dangling");
  if (isDangling !== 0) return isDangling;
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
  });
};
