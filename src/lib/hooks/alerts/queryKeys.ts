export const alertKeys = {
  all: ["alerts"] as const,
  active: () => [...alertKeys.all, "active"] as const,
  histories: () => [...alertKeys.all, "history"] as const,
  history: (container: string) =>
    [...alertKeys.histories(), container] as const,
};
