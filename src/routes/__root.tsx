import "../styles.css";

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { Monitor } from "@/components/features/monitor";
import EmptyState from "@/components/shared/empty-state";

const DevTools = import.meta.env.DEV
  ? lazy(() => import("@/components/shared/dev-tools"))
  : () => null;

const RootLayout = () => (
  <>
    <Monitor.AppShell>
      <Outlet />
    </Monitor.AppShell>
    <Suspense fallback={null}>
      <DevTools />
    </Suspense>
  </>
);

const NotFound = () => (
  <EmptyState
    title="Halaman tidak ditemukan"
    description="Pilih container di sidebar untuk melihat log-nya."
  />
);

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});
