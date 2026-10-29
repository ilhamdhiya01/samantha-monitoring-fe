export interface SystemStats {
  hostname: string;
  ip: string;
  os: string;
  dockerVersion: string;
  uptimeSec: number;
  cpu: {
    percent: number;
    load1: number;
    cores: number;
  };
  memory: {
    usedBytes: number;
    totalBytes: number;
    swapUsedBytes: number;
  };
  disk: {
    mount: string;
    usedBytes: number;
    totalBytes: number;
    // Bagian disk yang dipakai Docker (GET /system/df).
    dockerBytes: number;
  };
}
