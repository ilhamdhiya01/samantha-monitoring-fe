import classNames from "classnames";
import React from "react";

interface SectionCardProps {
  title: string;
  // Teks kecil di kanan judul (mis. "semua container").
  meta?: React.ReactNode;
  action?: React.ReactNode;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

// Section panel kanan: judul kecil tebal + isi.
const SectionCard = React.memo(
  ({ title, meta, action, id, className, children }: SectionCardProps) => (
    <section
      id={id}
      aria-label={title}
      className={classNames("border-b border-line px-4 py-3", className)}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="m-0 text-xs font-semibold">{title}</h2>
        {meta && (
          <span className="font-mono text-[11px] text-muted">{meta}</span>
        )}
        {action}
      </div>
      {children}
    </section>
  ),
);

SectionCard.displayName = "SectionCard";

export default SectionCard;
