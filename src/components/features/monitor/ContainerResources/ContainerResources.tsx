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

// Nama dapat sisa lebar; angka lebar tetap supaya kolom rata.
const COLUMNS =
  "grid grid-cols-[minmax(0,1fr)_2.5rem_3.25rem_3.25rem] gap-2 font-mono";
const ROW = `${COLUMNS} border-b border-line-soft py-1.25 text-[11.5px]`;

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
          <div
            role="row"
            className={`${COLUMNS} border-b border-line pb-1 text-[10.5px] text-muted`}
          >
            <span role="columnheader">container</span>
            <span role="columnheader" className="text-right">
              cpu
            </span>
            <span role="columnheader" className="text-right">
              ram
            </span>
            <span role="columnheader" className="text-right">
              up
            </span>
          </div>
          {/* Tinggi dibatasi: VPS dengan puluhan container tidak memanjangkan
              panel kanan. */}
          <div role="rowgroup" className="max-h-72 overflow-y-auto">
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
        </div>
      )}
    </SectionCard>
  );
});

ContainerResources.displayName = "ContainerResources";

export default ContainerResources;
