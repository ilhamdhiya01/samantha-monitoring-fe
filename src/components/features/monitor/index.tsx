import { default as ActiveAlerts } from "./ActiveAlerts";
import { default as AppShell } from "./AppShell";
import { default as ContainerRedirect } from "./ContainerRedirect";
import { default as ContainerResources } from "./ContainerResources";
import { default as ContainerView } from "./ContainerView";
import { default as ErrorChart } from "./ErrorChart";
import { default as ImagesTable } from "./ImagesTable";
import { default as LogViewer } from "./LogViewer";
import { default as ResourceCards } from "./ResourceCards";
import { default as Sidebar } from "./Sidebar";

export const Monitor = {
  ActiveAlerts,
  AppShell,
  ContainerRedirect,
  ContainerResources,
  ContainerView,
  ErrorChart,
  ImagesTable,
  LogViewer,
  ResourceCards,
  Sidebar,
} as const;
