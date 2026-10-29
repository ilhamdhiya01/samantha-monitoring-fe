import { Navigate } from "@tanstack/react-router";
import React from "react";

import EmptyState from "@/components/shared/empty-state";
import Skeleton from "@/components/ui/skeleton";
import { useContainers } from "@/lib/hooks/containers/useContainers";

// "/" langsung membuka log container pertama.
const ContainerRedirect = React.memo(() => {
  const { data: containers, isLoading, isError } = useContainers();

  if (isError) {
    return (
      <EmptyState
        title="Gagal memuat container"
        description="Backend monitor tidak bisa dihubungi. Coba muat ulang halaman."
      />
    );
  }

  if (isLoading || !containers) {
    return <Skeleton className="m-4 h-[60vh]" />;
  }

  const first = containers.at(0);
  if (!first) {
    return (
      <EmptyState
        title="Belum ada container"
        description="Docker belum menjalankan container apa pun di VPS ini."
      />
    );
  }

  return (
    <Navigate to="/containers/$name" params={{ name: first.name }} replace />
  );
});

ContainerRedirect.displayName = "ContainerRedirect";

export default ContainerRedirect;
