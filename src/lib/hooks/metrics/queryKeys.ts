export const metricKeys = {
  all: ["metrics"] as const,
  // Tanpa container = semua container.
  errorsHourly: (container?: string) =>
    [...metricKeys.all, "errors-hourly", container ?? "all"] as const,
};
