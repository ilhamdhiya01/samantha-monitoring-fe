import { Link } from "@tanstack/react-router";
import classNames from "classnames";
import React from "react";

import SectionMessage from "@/components/shared/section-message";
import Skeleton from "@/components/ui/skeleton";
import StatusDot from "@/components/ui/status-dot";
import { getRestartTone, getStatusTone } from "@/lib/helpers/threshold.helper";
import { useContainers } from "@/lib/hooks/containers/useContainers";

const ITEM =
  "flex min-h-9 shrink-0 items-center gap-2.5 border-b-2 px-4 text-left text-[13px] text-fg no-underline md:w-full md:border-b-0 md:border-l-2";

const ContainerNav = React.memo(() => {
  const { data: containers, isLoading, isError } = useContainers();

  if (isError) {
    return (
      <SectionMessage tone="danger" className="px-4">
        Gagal memuat container.
      </SectionMessage>
    );
  }

  if (isLoading || !containers) {
    return (
      <div className="flex gap-2 px-4 py-2 md:flex-col">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-5 w-24 md:w-full" />
        ))}
      </div>
    );
  }

  // Desktop: hanya daftar ini yang di-scroll saat container banyak, supaya
  // "Halaman" dan footer sidebar tetap terlihat.
  return (
    <ul className="m-0 flex list-none overflow-x-auto p-0 md:min-h-0 md:flex-1 md:flex-col md:overflow-x-hidden md:overflow-y-auto">
      {containers.map((container) => (
        <li key={container.id} className="shrink-0">
          <Link
            to="/containers/$name"
            params={{ name: container.name }}
            className={ITEM}
            activeProps={{ className: "border-sel-border bg-sel" }}
            inactiveProps={{ className: "border-transparent" }}
          >
            <StatusDot tone={getStatusTone(container.status)} />
            <span className="min-w-0 flex-1 truncate font-mono text-xs">
              {container.name}
            </span>
            {container.restartCount > 0 && (
              <span
                title={`${container.restartCount} restart`}
                className={classNames("font-mono text-[11px]", {
                  "text-err": getRestartTone(container.restartCount) === "err",
                  "text-warn-fg":
                    getRestartTone(container.restartCount) === "warn",
                })}
              >
                ↻{container.restartCount}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
});

ContainerNav.displayName = "ContainerNav";

export default ContainerNav;
