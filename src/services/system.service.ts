import { USE_MOCK } from "@/const/monitor.constant";
import { API_SYSTEM } from "@/endpoints";
import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types/api.types";
import type { SystemStats } from "@/lib/types/system.types";

import { getMockSystemStats } from "./mock/data.mock";

export const getSystemStats = async (): Promise<ApiResponse<SystemStats>> => {
  if (USE_MOCK) return getMockSystemStats();
  const res = await axiosInstance.get(API_SYSTEM);
  return res.data;
};
