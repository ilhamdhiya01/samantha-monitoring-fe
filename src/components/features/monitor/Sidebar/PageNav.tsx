import { Link } from "@tanstack/react-router";
import React from "react";

const LINK =
  "block min-h-8 shrink-0 px-4 leading-8 whitespace-nowrap text-fg no-underline hover:underline";

const PageNav = React.memo(() => (
  <div className="flex overflow-x-auto border-t border-line-soft md:flex-col md:border-t-0">
    <Link
      to="/images"
      className={LINK}
      activeProps={{ className: "font-medium" }}
    >
      Images &amp; deploy
    </Link>
    <Link
      to="/alerts"
      className={LINK}
      activeProps={{ className: "font-medium" }}
    >
      Alert
    </Link>
    <Link
      to="/settings"
      className={LINK}
      activeProps={{ className: "font-medium" }}
    >
      Pengaturan
    </Link>
  </div>
));

PageNav.displayName = "PageNav";

export default PageNav;
