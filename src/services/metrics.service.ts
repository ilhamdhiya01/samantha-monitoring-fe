import { USE_MOCK } from "@/const/monitor.constant";
import { API_ERRORS_HOURLY } from "@/endpoints";
import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types/api.types";
import type { ErrorHour } from "@/lib/types/log.types";

import { getMockErrorsHourly } from "./mock/data.mock";

// Tanpa `container` = semua container dijumlahkan.
export const getErrorsHourly = async (
  container?: string,
): Promise<ApiResponse<ErrorHour[]>> => {
  if (USE_MOCK) return getMockErrorsHourly(container);
  const res = await axiosInstance.get(API_ERRORS_HOURLY, {
    params: { container },
  });
  return res.data;
};
