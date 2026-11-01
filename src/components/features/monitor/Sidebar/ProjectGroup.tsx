import { useParams } from "@tanstack/react-router";
import classNames from "classnames";
import React, { useCallback, useId, useState } from "react";
import { LuChevronRight } from "react-icons/lu";

import StatusDot from "@/components/ui/status-dot";
import { countRunning, getProjectTone } from "@/lib/helpers/container.helper";
import type { ContainerInfo } from "@/lib/types/container.types";

import ContainerLink from "./ContainerLink";
import { NAV_ITEM } from "./sidebar.constant";

interface ProjectGroupProps {
  name: string;
  containers: ContainerInfo[];
  imageSizes: Map<string, number>;
}

// Satu compose project; dibuka untuk memilih service-nya. Grup yang berisi
// container yang sedang dibuka ikut terbuka, supaya sorotannya terlihat.
const ProjectGroup = React.memo(
  ({ name, containers, imageSizes }: ProjectGroupProps) => {
    const { name: activeName } = useParams({ strict: false });
    const containsActive = containers.some(
      (container) => container.name === activeName,
    );

    const [open, setOpen] = useState(containsActive);
    const [wasActive, setWasActive] = useState(containsActive);
    // Pindah ke service grup ini dari tempat lain (mis. link alert) → buka.
    if (containsActive !== wasActive) {
      setWasActive(containsActive);
      if (containsActive) setOpen(true);
    }

    const listId = useId();
    const toggle = useCallback(() => setOpen((value) => !value), []);
    const running = countRunning(containers);

    return (
      <li className="flex shrink-0 md:block">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={listId}
          className={classNames(
            NAV_ITEM,
            "cursor-pointer border-x-0 border-t-0 border-transparent bg-transparent",
            { "bg-sel": containsActive && !open },
          )}
        >
          <LuChevronRight
            aria-hidden
            className={classNames(
              "size-4 shrink-0 text-muted transition-transform",
              { "rotate-90": open },
            )}
          />
          <StatusDot
            tone={getProjectTone(containers)}
            title={`${running}/${containers.length} running`}
          />
          <span className="min-w-0 flex-1 truncate font-mono text-xs font-medium">
            {name}
          </span>
          <span
            title={`${running} dari ${containers.length} container running`}
            className="font-mono text-[11px] text-muted"
          >
            {running}/{containers.length}
          </span>
        </button>
        {open && (
          <ul id={listId} className="m-0 flex list-none p-0 md:flex-col">
            {containers.map((container) => (
              <li key={container.id} className="shrink-0">
                <ContainerLink
                  container={container}
                  imageSize={imageSizes.get(container.name)}
                  nested
                />
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  },
);

ProjectGroup.displayName = "ProjectGroup";

export default ProjectGroup;
