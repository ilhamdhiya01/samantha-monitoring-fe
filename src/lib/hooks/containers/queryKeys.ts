export const containerKeys = {
  all: ["containers"] as const,
  list: () => [...containerKeys.all, "list"] as const,
};
