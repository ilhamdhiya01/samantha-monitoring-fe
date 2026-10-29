import React from "react";

import SectionCard from "@/components/shared/section-card";
import SectionMessage from "@/components/shared/section-message";
import Skeleton from "@/components/ui/skeleton";
import {
  formatMemShort,
  formatPercent,
  formatUptimeSince,
} from "@/lib/helpers/format.helper";
import { useContainers } from "@/lib/hooks/containers/useContainers";
import { useNow } from "@/lib/hooks/useNow";

const ROW =
  "grid grid-cols-4 gap-2 border-b border-line-soft py-1.25 font-mono text-[11.5px]";

const ContainerResources = React.memo(() => {
  const { data: containers, isLoading, isError } = useContainers();
  const now = useNow(5_000);

  return (
    <SectionCard title="Resource per container" className="border-b-0">
      {isError && (
        <SectionMessage tone="danger">Gagal memuat container.</SectionMessage>
      )}
      {!isError && (isLoading || !containers) && (
        <Skeleton className="mt-2 h-24" />
      )}
      {containers && (
        <div
          className="mt-1.5"
          role="table"
          aria-label="Resource per container"
        >
          <div role="row" className="sr-only">
            <span role="columnheader">Container</span>
            <span role="columnheader">CPU</span>
            <span role="columnheader">RAM</span>
            <span role="columnheader">Uptime</span>
          </div>
          {containers.map((container) => (
            <div key={container.id} role="row" className={ROW}>
              <span role="cell" className="truncate" title={container.name}>
                {container.name}
              </span>
              <span role="cell" className="text-right text-fg-secondary">
                {formatPercent(container.cpuPercent)}
              </span>
              <span role="cell" className="text-right text-fg-secondary">
                {formatMemShort(container.memoryBytes)}
              </span>
              <span role="cell" className="text-right text-muted">
                {container.status === "running" ||
                container.status === "restarting"
                  ? formatUptimeSince(container.startedAt, now)
                  : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
});

ContainerResources.displayName = "ContainerResources";

export default ContainerResources;
