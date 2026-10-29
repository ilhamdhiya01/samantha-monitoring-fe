import React, { useMemo } from "react";

import SectionMessage from "@/components/shared/section-message";
import StatCard from "@/components/shared/stat-card";
import Skeleton from "@/components/ui/skeleton";
import {
  formatBytes,
  formatBytesPair,
  formatPercent,
} from "@/lib/helpers/format.helper";
import type { Tone } from "@/lib/helpers/threshold.helper";
import {
  getUsageTone,
  isFinished,
  toPercent,
} from "@/lib/helpers/threshold.helper";
import { useContainers } from "@/lib/hooks/containers/useContainers";
import { useSystemStats } from "@/lib/hooks/system/useSystemStats";

const GRID = "grid grid-cols-2 border-b border-line bg-panel lg:grid-cols-4";

const ContainerCard = React.memo(() => {
  const { data: containers } = useContainers();

  // Job yang selesai normal (exit 0, mis. *-migrate) bukan masalah: tidak
  // dihitung sebagai "berhenti" maupun dalam total.
  const summary = useMemo(() => {
    if (!containers) return null;
    const finished = containers.filter((c) =>
      isFinished(c.status, c.exitCode),
    ).length;
    const total = containers.length - finished;
    const running = containers.filter((c) => c.status === "running").length;
    const restarting = containers.filter(
      (c) => c.status === "restarting",
    ).length;
    const down = total - running - restarting;
    const tone: Tone = down > 0 ? "err" : restarting > 0 ? "warn" : "ok";
    const notes = [
      restarting > 0 && `${restarting} restarting`,
      down > 0 && `${down} berhenti`,
      restarting === 0 && down === 0 && "semua jalan",
      finished > 0 && `${finished} job selesai`,
    ].filter(Boolean);
    return {
      value: `${running} / ${total}`,
      note: notes.join(" · "),
      percent: toPercent(running, total),
      tone,
    };
  }, [containers]);

  if (!summary) return <Skeleton className="m-3 h-12" />;

  return <StatCard label="Container" {...summary} />;
});

ContainerCard.displayName = "ContainerCard";

const ResourceCards = React.memo(() => {
  const { data: system, isLoading, isError } = useSystemStats();

  if (isError) {
    return (
      <div className="border-b border-line bg-panel px-5">
        <SectionMessage tone="danger">
          Gagal memuat resource VPS.
        </SectionMessage>
      </div>
    );
  }

  if (isLoading || !system) {
    return (
      <div className={GRID}>
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="m-3 h-12" />
        ))}
      </div>
    );
  }

  const { cpu, memory, disk } = system;
  const memoryPercent = toPercent(memory.usedBytes, memory.totalBytes);
  const diskPercent = toPercent(disk.usedBytes, disk.totalBytes);

  return (
    <div className={GRID}>
      <StatCard
        label="CPU"
        value={formatPercent(cpu.percent)}
        note={`load ${cpu.load1.toFixed(2)} / ${cpu.cores} vCPU`}
        percent={cpu.percent}
        tone={getUsageTone(cpu.percent)}
      />
      <StatCard
        label="Memori"
        value={formatBytesPair(memory.usedBytes, memory.totalBytes)}
        note={`swap ${formatBytes(memory.swapUsedBytes)}`}
        percent={memoryPercent}
        tone={getUsageTone(memoryPercent)}
      />
      <StatCard
        label={`Disk ${disk.mount}`}
        value={formatBytesPair(disk.usedBytes, disk.totalBytes, 0)}
        note={`docker ${formatBytes(disk.dockerBytes)}`}
        percent={diskPercent}
        tone={getUsageTone(diskPercent)}
      />
      <ContainerCard />
    </div>
  );
});

ResourceCards.displayName = "ResourceCards";

export default ResourceCards;
