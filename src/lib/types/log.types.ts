export type LogLevel = "ERROR" | "WARN" | "INFO";

export type LogLevelFilter = "ALL" | LogLevel;

// Satu baris log. Level ditentukan parser di backend.
export interface LogLine {
  // Dipakai sebagai SSE id (Last-Event-ID saat reconnect).
  id: string;
  ts: string;
  level: LogLevel;
  text: string;
}

export type LogStreamStatus = "connecting" | "open" | "error";

export interface ErrorHour {
  // ISO, awal jam.
  hour: string;
  errors: number;
  warnings: number;
}

// Search params /containers/$name. Kosong = ALL / tanpa pencarian.
export interface LogSearch {
  level?: LogLevel;
  q?: string;
}
