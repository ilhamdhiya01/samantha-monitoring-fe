export type ContainerAction = "stop" | "start";

// GET /actions/status. Aksi mati secara default di BE (ACTIONS_ENABLED).
export interface ActionStatus {
  enabled: boolean;
  // Alasan untuk tooltip tombol kalau tidak aktif.
  disabledReason: string | null;
  // Compose project milik monitor sendiri; tidak bisa di-stop dari sini.
  protectedProjects: string[];
}

export interface ContainerActionResult {
  container: string;
  action: ContainerAction;
}
