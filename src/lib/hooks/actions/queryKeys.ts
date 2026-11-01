export const actionKeys = {
  all: ["actions"] as const,
  status: () => [...actionKeys.all, "status"] as const,
};
