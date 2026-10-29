import { useQuery } from "@tanstack/react-query";

import { POLL_ERRORS_MS } from "@/const/monitor.constant";
import type { ApiResponse } from "@/lib/types/api.types";
import type { ErrorHour } from "@/lib/types/log.types";
import { getErrorsHourly } from "@/services/metrics.service";

import { metricKeys } from "./queryKeys";

const selectChart = (response: ApiResponse<ErrorHour[]>) => {
  const hours = response.data;
  const peak = hours.reduce<ErrorHour | null>(
    (best, hour) => (!best || hour.errors > best.errors ? hour : best),
    null,
  );
  const totalErrors = hours.reduce((sum, hour) => sum + hour.errors, 0);
  const totalWarnings = hours.reduce((sum, hour) => sum + hour.warnings, 0);

  return { hours, peak, totalErrors, totalWarnings };
};

export const useErrorsHourly = () => {
  return useQuery({
    queryKey: metricKeys.errorsHourly(),
    queryFn: getErrorsHourly,
    select: selectChart,
    refetchInterval: POLL_ERRORS_MS,
  });
};
