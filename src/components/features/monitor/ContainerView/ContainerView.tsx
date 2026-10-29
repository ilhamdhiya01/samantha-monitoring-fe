import { useParams } from "@tanstack/react-router";
import React from "react";

import ActiveAlerts from "../ActiveAlerts";
import ContainerResources from "../ContainerResources";
import ErrorChart from "../ErrorChart";
import ImagesTable from "../ImagesTable";
import LogViewer from "../LogViewer";

// Layar utama: log container terpilih + panel kanan + tabel images.
const ContainerView = React.memo(() => {
  const { name } = useParams({ from: "/containers/$name" });

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col lg:flex-row">
        <LogViewer key={name} container={name} />
        <aside className="flex min-w-0 shrink-0 flex-col border-t border-line bg-panel lg:w-[300px] lg:border-t-0 xl:w-[320px]">
          <ErrorChart />
          <ActiveAlerts />
          <ContainerResources />
        </aside>
      </div>
      <ImagesTable />
    </div>
  );
});

ContainerView.displayName = "ContainerView";

export default ContainerView;
