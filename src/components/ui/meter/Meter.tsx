import React, { forwardRef } from "react";
import { tv } from "tailwind-variants";

import type { Tone } from "@/lib/helpers/threshold.helper";

const meter = tv({
  slots: {
    track: "block h-[3px] overflow-hidden bg-track",
    fill: "block h-full transition-[width] duration-500",
  },
  variants: {
    tone: {
      ok: { fill: "bg-ok" },
      warn: { fill: "bg-warn-fg" },
      err: { fill: "bg-err" },
      muted: { fill: "bg-muted" },
    },
  },
  defaultVariants: {
    tone: "ok",
  },
});

interface MeterProps extends React.HTMLAttributes<HTMLSpanElement> {
  // 0–100
  value: number;
  tone?: Tone;
  label: string;
}

const Meter = forwardRef<HTMLSpanElement, MeterProps>(
  ({ value, tone, label, className, ...props }, ref) => {
    const { track, fill } = meter({ tone });
    const percent = Math.max(0, Math.min(100, value));

    return (
      <span
        ref={ref}
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        className={track({ className })}
        {...props}
      >
        <span className={fill()} style={{ width: `${percent}%` }} />
      </span>
    );
  },
);

Meter.displayName = "Meter";

export default Meter;
