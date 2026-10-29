import React from "react";

import ResourceCards from "../ResourceCards";
import Sidebar from "../Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

// Kerangka semua halaman: sidebar + kartu resource VPS + isi halaman.
const AppShell = React.memo(({ children }: AppShellProps) => (
  <div className="flex min-h-screen flex-col bg-bg text-fg md:flex-row">
    <Sidebar />
    <main className="flex min-w-0 flex-1 flex-col">
      <ResourceCards />
      {children}
    </main>
  </div>
));

AppShell.displayName = "AppShell";

export default AppShell;
