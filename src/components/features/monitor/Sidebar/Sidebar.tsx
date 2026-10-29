import React from "react";

import ContainerNav from "./ContainerNav";
import HostInfo from "./HostInfo";
import PageNav from "./PageNav";
import SidebarFooter from "./SidebarFooter";

const HEADING =
  "px-4 pt-3 pb-1.5 text-[11px] font-semibold tracking-[0.06em] text-muted uppercase";

// Di HP sidebar jadi bar atas; daftar container bisa digeser horizontal.
const Sidebar = React.memo(() => (
  <nav
    aria-label="Navigasi"
    className="flex shrink-0 flex-col border-b border-line bg-panel md:sticky md:top-0 md:h-screen md:w-60 md:border-r md:border-b-0"
  >
    <HostInfo />
    <h2 className={`${HEADING} hidden md:block`}>Container</h2>
    <ContainerNav />
    <h2 className={`${HEADING} hidden pt-4 md:block`}>Halaman</h2>
    <PageNav />
    <SidebarFooter />
  </nav>
));

Sidebar.displayName = "Sidebar";

export default Sidebar;
