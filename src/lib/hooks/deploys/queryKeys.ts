export const deployKeys = {
  all: ["deploys"] as const,
  list: (container: string) => [...deployKeys.all, container] as const,
};
