import type { ImageInfo } from "@/lib/types/image.types";

// Ukuran image yang dipakai tiap container, untuk sidebar. Dicocokkan lewat
// `usedBy` (bukan repo:tag) supaya tepat juga untuk image dangling yang
// masih dipakai.
export const getImageSizeByContainer = (images: ImageInfo[]) => {
  const sizes = new Map<string, number>();
  images.forEach((image) =>
    image.usedBy.forEach((user) => sizes.set(user.name, image.sizeBytes)),
  );
  return sizes;
};
