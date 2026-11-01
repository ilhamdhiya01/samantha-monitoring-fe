import { Link } from "@tanstack/react-router";
import classNames from "classnames";
import React from "react";

import StatusDot from "@/components/ui/status-dot";
import { formatBytes } from "@/lib/helpers/format.helper";
import {
  getRestartTone,
  getStatusLabel,
  getStatusTone,
} from "@/lib/helpers/threshold.helper";
import type { ContainerInfo } from "@/lib/types/container.types";

import { NAV_ITEM } from "./sidebar.constant";

interface ContainerLinkProps {
  container: ContainerInfo;
  // Ukuran image-nya; undefined selama data images belum ada.
  imageSize?: number;
  // Di dalam grup project: tampil nama service ("app"), menjorok melewati
  // nama project supaya tidak sejajar dengan baris grup.
  nested?: boolean;
}

const ContainerLink = React.memo(
  ({ container, imageSize, nested = false }: ContainerLinkProps) => {
    const label = nested
      ? (container.service ?? container.name)
      : container.name;

    return (
      <Link
        to="/containers/$name"
        params={{ name: container.name }}
        title={label === container.name ? undefined : container.name}
        className={classNames(NAV_ITEM, { "md:pl-13": nested })}
        activeProps={{ className: "border-sel-border bg-sel" }}
        inactiveProps={{ className: "border-transparent" }}
      >
        <StatusDot
          tone={getStatusTone(
            container.status,
            container.exitCode,
            container.health,
          )}
          title={getStatusLabel(
            container.status,
            container.exitCode,
            container.health,
          )}
        />
        <span className="min-w-0 flex-1 truncate font-mono text-xs">
          {label}
        </span>
        {container.restartCount > 0 && (
          <span
            title={`${container.restartCount} restart`}
            className={classNames("font-mono text-[11px]", {
              "text-err": getRestartTone(container.restartCount) === "err",
              "text-warn-fg": getRestartTone(container.restartCount) === "warn",
            })}
          >
            ↻{container.restartCount}
          </span>
        )}
        {imageSize !== undefined && (
          <span
            title={`Ukuran image ${container.image}:${container.tag}`}
            className="hidden shrink-0 font-mono text-[11px] text-muted md:inline"
          >
            {formatBytes(imageSize)}
          </span>
        )}
      </Link>
    );
  },
);

ContainerLink.displayName = "ContainerLink";

export default ContainerLink;
