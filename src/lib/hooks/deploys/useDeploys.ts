import { useQuery } from "@tanstack/react-query";

import { POLL_HISTORY_MS } from "@/const/monitor.constant";
import { getDeploys } from "@/services/deploys.service";

import { deployKeys } from "./queryKeys";

// Deploy terbaru dulu (maks. 20), sejak monitor dipasang.
export const useDeploys = (container: string) => {
  return useQuery({
    queryKey: deployKeys.list(container),
    queryFn: () => getDeploys(container),
    select: (response) => response.data,
    refetchInterval: POLL_HISTORY_MS,
    staleTime: POLL_HISTORY_MS,
  });
};
