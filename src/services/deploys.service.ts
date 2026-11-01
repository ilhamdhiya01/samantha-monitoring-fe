import { USE_MOCK } from "@/const/monitor.constant";
import { API_DEPLOYS } from "@/endpoints";
import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types/api.types";
import type { DeployEvent } from "@/lib/types/deploy.types";

import { getMockDeploys } from "./mock/data.mock";

export const getDeploys = async (
  container: string,
): Promise<ApiResponse<DeployEvent[]>> => {
  if (USE_MOCK) return getMockDeploys(container);
  const res = await axiosInstance.get(API_DEPLOYS, { params: { container } });
  return res.data;
};
