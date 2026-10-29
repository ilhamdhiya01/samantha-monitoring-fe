import { USE_MOCK } from "@/const/monitor.constant";
import { API_ERRORS_HOURLY } from "@/endpoints";
import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types/api.types";
import type { ErrorHour } from "@/lib/types/log.types";

import { getMockErrorsHourly } from "./mock/data.mock";

export const getErrorsHourly = async (): Promise<ApiResponse<ErrorHour[]>> => {
  if (USE_MOCK) return getMockErrorsHourly();
  const res = await axiosInstance.get(API_ERRORS_HOURLY);
  return res.data;
};
