import { useQuery } from "@tanstack/react-query";

import { POLL_CONTAINERS_MS } from "@/const/monitor.constant";
import { useLivePollOptions } from "@/lib/hooks/useRealtimeStatus";
import type { ApiResponse } from "@/lib/types/api.types";
import type { ContainerInfo } from "@/lib/types/container.types";
import { getContainers } from "@/services/containers.service";

import { containerKeys } from "./queryKeys";

const selectList = (response: ApiResponse<ContainerInfo[]>) => response.data;

// Semua komponen pakai key yang sama → satu poll untuk semua container.
// Selama SSE /stream tersambung, data diisi dari stream dan polling mati.
export const useContainers = () => {
  const liveOptions = useLivePollOptions(POLL_CONTAINERS_MS);
  return useQuery({
    queryKey: containerKeys.list(),
    queryFn: getContainers,
    select: selectList,
    ...liveOptions,
  });
};

export const useContainer = (name: string) => {
  const liveOptions = useLivePollOptions(POLL_CONTAINERS_MS);
  return useQuery({
    queryKey: containerKeys.list(),
    queryFn: getContainers,
    select: (response) =>
      response.data.find((container) => container.name === name) ?? null,
    ...liveOptions,
  });
};
