import { createFileRoute } from "@tanstack/react-router";

import { Monitor } from "@/components/features/monitor";
import { LOG_LEVEL_FILTERS } from "@/const/monitor.constant";
import type { LogLevel, LogSearch } from "@/lib/types/log.types";

const isLogLevel = (value: unknown): value is LogLevel =>
  value !== "ALL" &&
  LOG_LEVEL_FILTERS.includes(value as (typeof LOG_LEVEL_FILTERS)[number]);

// ?level=ERROR&q=timeout — nilai tidak dikenal diabaikan.
const validateSearch = (search: Record<string, unknown>): LogSearch => ({
  level: isLogLevel(search.level) ? search.level : undefined,
  q: typeof search.q === "string" && search.q ? search.q : undefined,
});

const ContainerPage = () => <Monitor.ContainerView />;

export const Route = createFileRoute("/containers/$name")({
  validateSearch,
  component: ContainerPage,
});
