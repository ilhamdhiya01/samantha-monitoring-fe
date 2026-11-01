import type { ActionStatus, ContainerAction } from "@/lib/types/action.types";
import type { ContainerInfo } from "@/lib/types/container.types";

export interface ActionAvailability {
  action: ContainerAction;
  // null = tombol aktif; selain itu alasan untuk tooltip.
  disabledReason: string | null;
}

// Container yang jalan (atau restart loop) ditawari stop, selainnya start.
// BE tetap memeriksa ulang; ini hanya supaya tombol tidak menipu.
export const getActionAvailability = (
  container: ContainerInfo,
  status: ActionStatus | undefined,
): ActionAvailability => {
  const action: ContainerAction =
    container.status === "running" ||
    container.status === "restarting" ||
    container.status === "paused"
      ? "stop"
      : "start";

  if (!status) return { action, disabledReason: "Memuat status aksi…" };
  if (!status.enabled) {
    return {
      action,
      disabledReason: status.disabledReason ?? "Aksi tidak tersedia",
    };
  }
  if (
    container.project &&
    status.protectedProjects.includes(container.project)
  ) {
    return {
      action,
      disabledReason:
        "Container milik monitor sendiri tidak bisa dihentikan dari sini",
    };
  }
  return { action, disabledReason: null };
};
