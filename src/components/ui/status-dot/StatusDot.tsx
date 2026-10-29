import React, { forwardRef } from "react";
import { tv } from "tailwind-variants";

import type { Tone } from "@/lib/helpers/threshold.helper";

const dot = tv({
  base: "inline-block shrink-0 rounded-full",
  variants: {
    tone: {
      ok: "bg-ok",
      warn: "bg-warn-fg",
      err: "bg-err",
      muted: "bg-muted",
    },
    size: {
      sm: "size-1.5",
      md: "size-[7px]",
    },
  },
  defaultVariants: {
    tone: "muted",
    size: "md",
  },
});

interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: keyof typeof dot.variants.size;
}

const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ tone, size, className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden
      className={dot({ tone, size, className })}
      {...props}
    />
  ),
);

StatusDot.displayName = "StatusDot";

export default StatusDot;
