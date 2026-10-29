import classNames from "classnames";
import React from "react";

interface SectionMessageProps {
  tone?: "muted" | "danger";
  className?: string;
  children: React.ReactNode;
}

// Pesan kecil di dalam section: gagal memuat atau kosong.
const SectionMessage = React.memo(
  ({ tone = "muted", className, children }: SectionMessageProps) => (
    <p
      role={tone === "danger" ? "alert" : undefined}
      className={classNames(
        "m-0 py-3 text-xs",
        { "text-muted": tone === "muted", "text-err": tone === "danger" },
        className,
      )}
    >
      {children}
    </p>
  ),
);

SectionMessage.displayName = "SectionMessage";

export default SectionMessage;
