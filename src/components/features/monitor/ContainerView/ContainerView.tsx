import { useParams } from "@tanstack/react-router";
import React from "react";

import ActiveAlerts from "../ActiveAlerts";
import ContainerHistory from "../ContainerHistory";
import ContainerResources from "../ContainerResources";
import ErrorChart from "../ErrorChart";
import LogViewer from "../LogViewer";

// Layar utama: log container terpilih + panel kanan yang fokus ke container
// itu (error, riwayat). Alert aktif dan resource tetap lintas container;
// tabel image lengkap ada di /images.
const ContainerView = React.memo(() => {
  const { name } = useParams({ from: "/containers/$name" });

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <LogViewer key={name} container={name} />
      <aside className="flex min-w-0 shrink-0 flex-col border-t border-line bg-panel lg:w-[300px] lg:border-t-0 xl:w-[320px]">
        <ErrorChart container={name} />
        <ContainerHistory container={name} />
        <ActiveAlerts />
        <ContainerResources activeName={name} />
      </aside>
    </div>
  );
});

ContainerView.displayName = "ContainerView";

export default ContainerView;
