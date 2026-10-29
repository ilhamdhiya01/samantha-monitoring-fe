import React from "react";

import Button from "@/components/ui/button";
import { formatRelative } from "@/lib/helpers/format.helper";
import { useContainers } from "@/lib/hooks/containers/useContainers";
import { useNow } from "@/lib/hooks/useNow";
import { useTheme } from "@/lib/hooks/useTheme";

// Label sinkron dipisah supaya hanya bagian ini yang render tiap detik.
const SyncLabel = () => {
  const { dataUpdatedAt, isError } = useContainers();
  const now = useNow();

  if (isError)
    return <span className="text-[11px] text-err">gagal sinkron</span>;
  if (!dataUpdatedAt)
    return <span className="text-[11px] text-muted">menyinkron…</span>;

  return (
    <span className="text-[11px] text-muted">
      sinkron {formatRelative(dataUpdatedAt, now)}
    </span>
  );
};

const SidebarFooter = React.memo(() => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between gap-2 border-t border-line-soft px-4 py-2.5 md:mt-auto">
      <SyncLabel />
      <Button
        mono
        onClick={toggleTheme}
        aria-label="Ganti tema terang atau gelap"
      >
        {theme === "dark" ? "terang" : "gelap"}
      </Button>
    </div>
  );
});

SidebarFooter.displayName = "SidebarFooter";

export default SidebarFooter;
