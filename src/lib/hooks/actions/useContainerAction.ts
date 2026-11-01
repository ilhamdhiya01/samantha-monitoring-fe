import { useMutation, useQueryClient } from "@tanstack/react-query";

import { alertKeys } from "@/lib/hooks/alerts/queryKeys";
import { containerKeys } from "@/lib/hooks/containers/queryKeys";
import type { ContainerAction } from "@/lib/types/action.types";
import { runContainerAction } from "@/services/actions.service";

interface Variables {
  container: string;
  action: ContainerAction;
}

// Status baru juga datang lewat SSE /stream; invalidate untuk mode polling
// dan mock.
export const useContainerAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ container, action }: Variables) =>
      runContainerAction(container, action),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: containerKeys.list() });
      void queryClient.invalidateQueries({ queryKey: alertKeys.histories() });
    },
  });
};
