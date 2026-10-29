import { USE_MOCK } from "@/const/monitor.constant";
import { API_CONTAINERS } from "@/endpoints";
import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types/api.types";
import type { ContainerInfo } from "@/lib/types/container.types";

import { getMockContainers } from "./mock/data.mock";

export const getContainers = async (): Promise<
  ApiResponse<ContainerInfo[]>
> => {
  if (USE_MOCK) return getMockContainers();
  const res = await axiosInstance.get(API_CONTAINERS);
  return res.data;
};
