import { useQuery } from "@tanstack/react-query";

import { getActionStatus } from "@/services/actions.service";

import { actionKeys } from "./queryKeys";

// Dari env BE; hanya berubah saat BE di-restart.
export const useActionStatus = () => {
  return useQuery({
    queryKey: actionKeys.status(),
    queryFn: getActionStatus,
    select: (response) => response.data,
    staleTime: 5 * 60_000,
  });
};
