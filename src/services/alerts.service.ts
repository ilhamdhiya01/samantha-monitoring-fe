import { USE_MOCK } from "@/const/monitor.constant";
import { API_ALERTS_ACTIVE } from "@/endpoints";
import axiosInstance from "@/lib/axios";
import type { Alert } from "@/lib/types/alert.types";
import type { ApiResponse } from "@/lib/types/api.types";

import { getMockActiveAlerts } from "./mock/data.mock";

export const getActiveAlerts = async (): Promise<ApiResponse<Alert[]>> => {
  if (USE_MOCK) return getMockActiveAlerts();
  const res = await axiosInstance.get(API_ALERTS_ACTIVE);
  return res.data;
};
