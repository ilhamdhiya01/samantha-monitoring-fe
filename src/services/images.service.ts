import { USE_MOCK } from "@/const/monitor.constant";
import { API_IMAGES } from "@/endpoints";
import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types/api.types";
import type { ImageSummary } from "@/lib/types/image.types";

import { getMockImages } from "./mock/data.mock";

export const getImages = async (): Promise<ApiResponse<ImageSummary>> => {
  if (USE_MOCK) return getMockImages();
  const res = await axiosInstance.get(API_IMAGES);
  return res.data;
};
