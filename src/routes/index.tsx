import { createFileRoute } from "@tanstack/react-router";

import { Monitor } from "@/components/features/monitor";

const HomePage = () => <Monitor.ContainerRedirect />;

export const Route = createFileRoute("/")({ component: HomePage });
