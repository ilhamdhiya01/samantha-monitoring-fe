const GB = 1024 ** 3;
const MB = 1024 ** 2;

const MONTHS_ID = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const pad = (value: number, length = 2) => String(value).padStart(length, "0");

// Desimal gaya Indonesia: 2,9 bukan 2.9.
export const formatDecimal = (value: number, digits = 1) =>
  value.toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

// "18,4 GB", "212 MB"
export const formatBytes = (bytes: number) => {
  if (bytes >= GB) return `${formatDecimal(bytes / GB)} GB`;
  return `${Math.round(bytes / MB)} MB`;
};

// "2,9 / 4,0 GB"
export const formatBytesPair = (used: number, total: number, digits = 1) =>
  `${formatDecimal(used / GB, digits)} / ${formatDecimal(total / GB, digits)} GB`;

// Kolom sempit resource per container: "310M", "1,2G".
export const formatMemShort = (bytes: number) => {
  if (bytes >= GB) return `${formatDecimal(bytes / GB)}G`;
  return `${Math.round(bytes / MB)}M`;
};

export const formatPercent = (value: number) => `${Math.round(value)}%`;

// "10s", "5m", "3h", "2d 4h", "23d"
export const formatDuration = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  if (s < 60) return `${s}s`;
  const minutes = Math.floor(s / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  const restHours = hours % 24;
  return days < 7 && restHours > 0 ? `${days}d ${restHours}h` : `${days}d`;
};

export const formatUptimeSince = (iso: string | null, now: number) =>
  iso ? formatDuration((now - Date.parse(iso)) / 1000) : "—";

// "baru saja", "2 mnt lalu", "1 jam lalu", "3 hari lalu"
export const formatRelative = (iso: string | number, now: number) => {
  const time = typeof iso === "number" ? iso : Date.parse(iso);
  const seconds = Math.max(0, Math.round((now - time) / 1000));
  if (seconds < 60) return seconds < 5 ? "baru saja" : `${seconds} dtk lalu`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mnt lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
};

// "10:42"
export const formatClock = (iso: string) => {
  const date = new Date(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// "10:42:01.221"
export const formatLogTime = (iso: string) => {
  const date = new Date(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds(),
  )}.${pad(date.getMilliseconds(), 3)}`;
};

// "28 Okt 21:14"
export const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${formatClock(iso)}`;
};

// Docker image id dipendekkan seperti `docker images`.
export const shortImageId = (id: string) =>
  id.replace(/^sha256:/, "").slice(0, 12);
