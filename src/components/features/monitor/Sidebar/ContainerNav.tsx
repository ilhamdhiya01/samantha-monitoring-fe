import React, { useMemo } from "react";

import SectionMessage from "@/components/shared/section-message";
import Skeleton from "@/components/ui/skeleton";
import { groupContainersByProject } from "@/lib/helpers/container.helper";
import { getImageSizeByContainer } from "@/lib/helpers/image.helper";
import { useContainers } from "@/lib/hooks/containers/useContainers";
import { useImages } from "@/lib/hooks/images/useImages";

import ContainerLink from "./ContainerLink";
import ProjectGroup from "./ProjectGroup";

const ContainerNav = React.memo(() => {
  const { data: containers, isLoading, isError } = useContainers();
  // Ukuran image hanya pelengkap: selama belum ada (atau gagal), kolomnya
  // kosong — daftar container tidak ikut tertahan.
  const { data: imageSummary } = useImages();

  const entries = useMemo(
    () => (containers ? groupContainersByProject(containers) : []),
    [containers],
  );
  const imageSizes = useMemo(
    () => getImageSizeByContainer(imageSummary?.images ?? []),
    [imageSummary],
  );

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
      {entries.map((entry) =>
        entry.kind === "project" ? (
          <ProjectGroup
            key={`project:${entry.name}`}
            name={entry.name}
            containers={entry.containers}
            imageSizes={imageSizes}
          />
        ) : (
          <li key={entry.container.id} className="shrink-0">
            <ContainerLink
              container={entry.container}
              imageSize={imageSizes.get(entry.container.name)}
            />
          </li>
        ),
      )}
    </ul>
  );
});

ContainerNav.displayName = "ContainerNav";

export default ContainerNav;
