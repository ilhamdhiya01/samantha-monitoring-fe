import { createFileRoute } from "@tanstack/react-router";

import EmptyState from "@/components/shared/empty-state";

const SettingsPage = () => (
  <EmptyState
    title="Pengaturan"
    description="Aturan level log per container, token Telegram dan ambang alert akan diatur di sini."
  />
);

export const Route = createFileRoute("/settings")({ component: SettingsPage });
