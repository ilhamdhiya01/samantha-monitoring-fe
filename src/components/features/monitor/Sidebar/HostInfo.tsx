import React from "react";

import Skeleton from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/helpers/format.helper";
import { useSystemStats } from "@/lib/hooks/system/useSystemStats";

const META = "truncate font-mono text-[11px] text-muted";

// Satu fakta per baris, dipotong dengan elipsis (lengkap di tooltip) —
// "Ubuntu 24.04.4 LTS" tidak lagi patah di tengah.
const HostInfo = React.memo(() => {
  const { data: system, isLoading } = useSystemStats();

  return (
    <div className="min-w-0 border-b border-line-soft px-4 pt-3.5 pb-3">
      {isLoading || !system ? (
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-36" />
        </div>
      ) : (
        <>
          <div
            className="truncate text-[13px] font-semibold"
            title={system.hostname}
          >
            {system.hostname}
          </div>
          <div className={`${META} mt-0.5`} title={system.ip}>
            {system.ip}
          </div>
          <div className={META} title={system.os}>
            {system.os}
          </div>
          <div className={META}>
            Docker {system.dockerVersion} · up{" "}
            {formatDuration(system.uptimeSec)}
          </div>
        </>
      )}
    </div>
  );
});

HostInfo.displayName = "HostInfo";

export default HostInfo;
