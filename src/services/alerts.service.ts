import { USE_MOCK } from "@/const/monitor.constant";
import { API_ALERTS_ACTIVE, API_ALERTS_HISTORY } from "@/endpoints";
import axiosInstance from "@/lib/axios";
import type { Alert, AlertHistoryItem } from "@/lib/types/alert.types";
import type { ApiResponse } from "@/lib/types/api.types";

import { getMockActiveAlerts, getMockAlertHistory } from "./mock/data.mock";

export const getActiveAlerts = async (): Promise<ApiResponse<Alert[]>> => {
  if (USE_MOCK) return getMockActiveAlerts();
  const res = await axiosInstance.get(API_ALERTS_ACTIVE);
  return res.data;
};

export const getAlertHistory = async (
  container: string,
): Promise<ApiResponse<AlertHistoryItem[]>> => {
  if (USE_MOCK) return getMockAlertHistory(container);
  const res = await axiosInstance.get(API_ALERTS_HISTORY, {
    params: { container },
  });
  return res.data;
};
