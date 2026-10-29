import React from "react";

import Skeleton from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/helpers/format.helper";
import { useSystemStats } from "@/lib/hooks/system/useSystemStats";

const HostInfo = React.memo(() => {
  const { data: system, isLoading } = useSystemStats();

  return (
    <div className="border-b border-line-soft px-4 pt-3.5 pb-3">
      {isLoading || !system ? (
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-36" />
        </div>
      ) : (
        <>
          <div className="text-[13px] font-semibold">{system.hostname}</div>
          <div className="mt-0.5 font-mono text-[11px] text-muted">
            {system.ip} · {system.os}
          </div>
          <div className="font-mono text-[11px] text-muted">
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
