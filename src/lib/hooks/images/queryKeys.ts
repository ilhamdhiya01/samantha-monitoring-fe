export const imageKeys = {
  all: ["images"] as const,
  summary: () => [...imageKeys.all, "summary"] as const,
};
