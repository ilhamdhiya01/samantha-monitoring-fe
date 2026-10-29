export const metricKeys = {
  all: ["metrics"] as const,
  errorsHourly: () => [...metricKeys.all, "errors-hourly"] as const,
};
