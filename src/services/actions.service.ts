import { USE_MOCK } from "@/const/monitor.constant";
import { API_ACTIONS_STATUS, API_CONTAINER_ACTION } from "@/endpoints";
import axiosInstance from "@/lib/axios";
import type {
  ActionStatus,
  ContainerAction,
  ContainerActionResult,
} from "@/lib/types/action.types";
import type { ApiResponse } from "@/lib/types/api.types";

import { getMockActionStatus, runMockContainerAction } from "./mock/data.mock";

export const getActionStatus = async (): Promise<ApiResponse<ActionStatus>> => {
  if (USE_MOCK) return getMockActionStatus();
  const res = await axiosInstance.get(API_ACTIONS_STATUS);
  return res.data;
};

// `confirm` = nama container yang diketik user; BE menolak kalau beda.
export const runContainerAction = async (
  container: string,
  action: ContainerAction,
): Promise<ApiResponse<ContainerActionResult>> => {
  if (USE_MOCK) return runMockContainerAction(container, action);
  const res = await axiosInstance.post(
    API_CONTAINER_ACTION(container, action),
    {
      confirm: container,
    },
  );
  return res.data;
};
