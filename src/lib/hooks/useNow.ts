import { useEffect, useState } from "react";

// Waktu sekarang yang diperbarui berkala, untuk label "N dtk lalu".
export const useNow = (intervalMs = 1_000) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
};
