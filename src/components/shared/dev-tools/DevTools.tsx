import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import React from "react";

// Hanya dimuat saat dev (lazy di routes/__root.tsx).
const DevTools = React.memo(() => (
  <TanStackDevtools
    config={{ position: "bottom-right" }}
    plugins={[
      { name: "TanStack Router", render: <TanStackRouterDevtoolsPanel /> },
    ]}
  />
));

DevTools.displayName = "DevTools";

export default DevTools;
