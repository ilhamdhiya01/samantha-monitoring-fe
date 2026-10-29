export const alertKeys = {
  all: ["alerts"] as const,
  active: () => [...alertKeys.all, "active"] as const,
};
