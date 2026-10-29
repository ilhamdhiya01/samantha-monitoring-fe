import { createFileRoute } from "@tanstack/react-router";

import { Monitor } from "@/components/features/monitor";

const ImagesPage = () => <Monitor.ImagesTable />;

export const Route = createFileRoute("/images")({ component: ImagesPage });
