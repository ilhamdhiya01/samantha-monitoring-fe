export const systemKeys = {
  all: ["system"] as const,
  stats: () => [...systemKeys.all, "stats"] as const,
};
